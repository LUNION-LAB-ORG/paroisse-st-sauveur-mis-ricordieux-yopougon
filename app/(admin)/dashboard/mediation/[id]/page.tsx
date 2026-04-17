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
import { mediationAPI } from "@/features/mediation/apis/mediation.api"
import type { IMediation } from "@/features/mediation/types/mediation.type"

const CATEGORIES = [
  "Prière",
  "Évangile",
  "Témoignage",
  "Réflexion",
  "Mariologie",
  "Temps liturgique",
  "Autre",
] as const

export default function MeditationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [mediation, setMediation] = useState<IMediation | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("Évangile")
  const [dateAt, setDateAt] = useState<string>("")
  const [content, setContent] = useState("")
  const [status, setStatus] = useState<"published" | "draft">("draft")
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!id) return
    mediationAPI
      .obtenirUn(id)
      .then((res) => {
        const m = res.data
        setMediation(m)
        setTitle(m.title ?? "")
        setAuthor(m.author ?? "")
        setCategory(m.category ?? "Évangile")
        setDateAt(m.date_at ? new Date(m.date_at).toISOString().slice(0, 10) : "")
        setContent(m.content ?? "")
        setStatus(m.status === "published" ? "published" : "draft")
      })
      .catch(() => toast.error("Impossible de charger la méditation"))
      .finally(() => setLoading(false))
  }, [id])

  const save = async () => {
    if (!title.trim() || !author.trim()) {
      toast.error("Titre et auteur sont obligatoires")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("_method", "PUT")
      fd.append("title", title)
      fd.append("author", author)
      fd.append("category", category)
      if (dateAt) fd.append("date_at", dateAt)
      fd.append("content", content)
      fd.append("mediation_status", status)
      if (imageFile) fd.append("image", imageFile)

      await mediationAPI.modifier(Number(id), fd)
      toast.success("Méditation mise à jour")
      router.push("/dashboard/mediation")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lors de la mise à jour"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    try {
      await mediationAPI.supprimer(Number(id))
      toast.success("Méditation supprimée")
      router.push("/dashboard/mediation")
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  if (loading) return <div className="text-gray-400 py-24 text-center">Chargement...</div>
  if (!mediation)
    return (
      <div className="text-gray-500 py-24 text-center">
        Méditation introuvable.{" "}
        <Link href="/dashboard/mediation" className="text-[#2d2d83] underline">
          Retour
        </Link>
      </div>
    )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/mediation"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier la méditation</h1>
            <p className="text-sm text-gray-500">
              {mediation.views ?? 0} vue{(mediation.views ?? 0) > 1 ? "s" : ""}
            </p>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  placeholder="Le texte complet de la méditation..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 leading-relaxed"
                />
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d2d83]">Paramètres</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus("published")}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium ${status === "published" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                  >
                    Publié
                  </button>
                  <button
                    onClick={() => setStatus("draft")}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium ${status === "draft" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"}`}
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
                initialImageUrl={mediation.image ?? null}
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
            <DialogTitle>Supprimer cette méditation ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Cette action est irréversible.</p>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setDeleteOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" className="bg-red-600" onPress={remove}>
              Confirmer la suppression
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
