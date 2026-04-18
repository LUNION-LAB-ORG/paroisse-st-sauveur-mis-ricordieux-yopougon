"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Card, Button } from "@heroui/react"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { programmationAPI } from "@/features/programmation/apis/programmation.api"
import { PROGRAMMATION_CATEGORIES } from "@/features/programmation/types/programmation.type"

export default function NouvelleProgrammationPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [category, setCategory] = useState<string>("Solennité")
  const [dateAt, setDateAt] = useState<string>(new Date().toISOString().slice(0, 10))
  const [startedAt, setStartedAt] = useState<string>("18:00")
  const [endedAt, setEndedAt] = useState<string>("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [isPublished, setIsPublished] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!name.trim() || !description.trim()) {
      toast.error("Nom et description sont obligatoires.")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("name", name)
      if (category) fd.append("category", category)
      fd.append("date_at", dateAt)
      fd.append("started_at", startedAt)
      if (endedAt) fd.append("ended_at", endedAt)
      fd.append("description", description)
      if (location) fd.append("location", location)
      fd.append("is_published", isPublished ? "1" : "0")
      if (imageFile) fd.append("image", imageFile)

      await programmationAPI.ajouter(fd)
      toast.success("Programmation créée")
      router.push("/dashboard/programmations")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de la création")
    } finally {
      setSaving(false)
    }
  }

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
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouvelle programmation</h1>
            <p className="text-sm text-gray-500">Annoncez un temps liturgique fort</p>
          </div>
        </div>
        <Button variant="primary" isDisabled={saving} onPress={submit} className="bg-[#98141f] rounded-xl">
          <Save className="w-4 h-4" /> Enregistrer
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Triduum pascal 2026"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={10}
                  placeholder="Présentation détaillée de la programmation..."
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={dateAt}
                  onChange={(e) => setDateAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
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
                  placeholder="Ex : Église paroissiale"
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
              <ImageUploadField onChange={setImageFile} title="Image de couverture" />
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
