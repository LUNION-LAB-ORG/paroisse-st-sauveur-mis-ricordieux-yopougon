"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Card, Button } from "@heroui/react"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { actualiteAPI } from "@/features/actualite/apis/actualite.api"

const CATEGORIES = ["Annonce", "Événement", "Liturgie", "Vie paroissiale", "Autre"] as const

export default function NouvelArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<string>("Annonce")
  const [resume, setResume] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState<"published" | "draft">("draft")
  const [publishedAt, setPublishedAt] = useState<string>(new Date().toISOString().slice(0, 10))
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async (finalStatus: "published" | "draft") => {
    if (!title.trim() || !resume.trim() || !content.trim() || !location.trim() || !author.trim()) {
      toast.error("Merci de remplir tous les champs obligatoires (titre, résumé, contenu, lieu, auteur).")
      return
    }
    if (!imageFile) {
      toast.error("Une image est requise pour publier un article.")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("title", title)
      fd.append("category", category)
      fd.append("new_resume", resume)
      fd.append("content", content)
      fd.append("location", location)
      fd.append("author", author)
      fd.append("new_status", finalStatus)
      fd.append("published_at", publishedAt)
      fd.append("image", imageFile)

      await actualiteAPI.ajouter(fd)
      toast.success(finalStatus === "published" ? "Article publié" : "Brouillon enregistré")
      router.push("/dashboard/actualites")
    } catch (e: unknown) {
      console.error(e)
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
            href="/dashboard/actualites"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouvel article</h1>
            <p className="text-sm text-gray-500">Rédigez puis publiez ou enregistrez comme brouillon.</p>
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
                  placeholder="Titre de l'article"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé *</label>
                <textarea
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                  rows={2}
                  placeholder="Un court résumé (affiché sur la liste)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contenu *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  placeholder="Contenu détaillé de l'article"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de publication</label>
                <input
                  type="date"
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lieu *</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ex: Église paroissiale"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auteur *</label>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Ex: Père Joseph"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <ImageUploadField onChange={setImageFile} title="Image principale *" />
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
