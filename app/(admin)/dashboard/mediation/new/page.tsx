"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Card, Button } from "@heroui/react"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { mediationAPI } from "@/features/mediation/apis/mediation.api"

const CATEGORIES = [
  "Prière",
  "Évangile",
  "Témoignage",
  "Réflexion",
  "Mariologie",
  "Temps liturgique",
  "Autre",
] as const

export default function NouvelleMeditationPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState<string>("Évangile")
  const [dateAt, setDateAt] = useState<string>(new Date().toISOString().slice(0, 10))
  const [content, setContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (finalStatus: "published" | "draft") => {
    if (!title.trim() || !author.trim()) {
      toast.error("Titre et auteur sont obligatoires.")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("title", title)
      fd.append("author", author)
      fd.append("category", category)
      fd.append("date_at", dateAt)
      if (content.trim()) fd.append("content", content)
      fd.append("mediation_status", finalStatus)
      if (imageFile) fd.append("image", imageFile)

      await mediationAPI.ajouter(fd)
      toast.success(finalStatus === "published" ? "Méditation publiée" : "Brouillon enregistré")
      router.push("/dashboard/mediation")
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lors de la création"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

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
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouvelle méditation</h1>
            <p className="text-sm text-gray-500">Partagez une réflexion spirituelle avec la communauté</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            isDisabled={saving}
            onPress={() => submit("draft")}
            className="rounded-xl text-gray-600"
          >
            Enregistrer brouillon
          </Button>
          <Button
            variant="primary"
            isDisabled={saving}
            onPress={() => submit("published")}
            className="bg-[#98141f] rounded-xl"
          >
            <Save className="w-4 h-4" /> Publier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la méditation"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  placeholder="Le texte complet de la méditation (versets, commentaires, prière...)"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur *</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ex : Père Joseph Kouadio"
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
