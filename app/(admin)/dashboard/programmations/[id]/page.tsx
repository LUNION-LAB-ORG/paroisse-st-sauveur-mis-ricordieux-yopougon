"use client"

import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, Button } from "@heroui/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { programmationAPI } from "@/features/programmation/apis/programmation.api"
import {
  IProgrammation,
  PROGRAMMATION_CATEGORIES,
} from "@/features/programmation/types/programmation.type"

function timeFromIso(iso: string | null | undefined): string {
  if (!iso) return ""
  if (/^\d{2}:\d{2}/.test(iso)) return iso.slice(0, 5)
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  return d.toTimeString().slice(0, 5)
}

function dateFromIso(iso: string | null | undefined): string {
  if (!iso) return ""
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export default function ProgrammationEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [programmation, setProgrammation] = useState<IProgrammation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [name, setName] = useState("")
  const [category, setCategory] = useState("Solennité")
  const [dateAt, setDateAt] = useState("")
  const [startedAt, setStartedAt] = useState("")
  const [endedAt, setEndedAt] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!id) return
    programmationAPI
      .obtenirUn(id)
      .then((res) => {
        const p = res.data
        setProgrammation(p)
        setName(p.name)
        setCategory(p.category ?? "Solennité")
        setDateAt(dateFromIso(p.date_at))
        setStartedAt(timeFromIso(p.started_at))
        setEndedAt(timeFromIso(p.ended_at))
        setDescription(p.description)
        setLocation(p.location ?? "")
        setIsPublished(p.is_published)
      })
      .catch(() => toast.error("Impossible de charger"))
      .finally(() => setLoading(false))
  }, [id])

  const save = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Nom et description sont obligatoires")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("_method", "PUT")
      fd.append("name", name)
      fd.append("category", category)
      fd.append("date_at", dateAt)
      fd.append("started_at", startedAt)
      if (endedAt) fd.append("ended_at", endedAt)
      fd.append("description", description)
      fd.append("location", location)
      fd.append("is_published", isPublished ? "1" : "0")
      if (imageFile) fd.append("image", imageFile)

      await programmationAPI.modifier(String(id), fd)
      toast.success("Mise à jour effectuée")
      router.push("/dashboard/programmations")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    try {
      await programmationAPI.supprimer(Number(id))
      toast.success("Supprimée")
      router.push("/dashboard/programmations")
    } catch {
      toast.error("Erreur")
    }
  }

  if (loading) return <div className="text-gray-400 py-24 text-center">Chargement...</div>
  if (!programmation)
    return (
      <div className="text-gray-500 py-24 text-center">
        Programmation introuvable.{" "}
        <Link href="/dashboard/programmations" className="text-[#2d2d83] underline">
          Retour
        </Link>
      </div>
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/programmations"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier la programmation</h1>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            isDisabled={saving}
            onPress={() => setDeleteOpen(true)}
            className="rounded-xl text-red-600"
          >
            <Trash2 className="w-4 h-4" /> Supprimer
          </Button>
          <Button
            variant="primary"
            isDisabled={saving}
            onPress={save}
            className="bg-[#98141f] rounded-xl"
          >
            <Save className="w-4 h-4" /> Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 leading-relaxed"
                />
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d2d83]">Date et lieu</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
                >
                  {PROGRAMMATION_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={dateAt}
                  onChange={(e) => setDateAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début</label>
                  <input
                    type="time"
                    value={startedAt}
                    onChange={(e) => setStartedAt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                  <input
                    type="time"
                    value={endedAt}
                    onChange={(e) => setEndedAt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsPublished(true)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium ${isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Publiée
                  </button>
                  <button
                    onClick={() => setIsPublished(false)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium ${!isPublished ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Brouillon
                  </button>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <ImageUploadField
                initialImageUrl={programmation.image ?? null}
                onChange={setImageFile}
                title="Image de couverture"
              />
            </Card.Content>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cette programmation ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Cette action est irréversible.</p>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setDeleteOpen(false)}>Annuler</Button>
            <Button variant="primary" className="bg-red-600" onPress={remove}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
