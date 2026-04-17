"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Card, Button } from "@heroui/react"
import { mediationAPI } from "@/features/mediation/apis/mediation.api"

const CATEGORIES = ["Prière", "Évangile", "Témoignage", "Réflexion", "Mariologie", "Temps liturgique", "Autre"] as const

export default function NouvelleMeditationPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState<string>("Évangile")
  const [dateAt, setDateAt] = useState<string>(new Date().toISOString().slice(0, 10))
  const [status, setStatus] = useState<"published" | "draft">("draft")
  const [saving, setSaving] = useState(false)

  const submit = async (finalStatus: "published" | "draft") => {
    if (!title.trim() || !author.trim()) {
      toast.error("Titre et auteur sont obligatoires.")
      return
    }
    setSaving(true)
    try {
      await mediationAPI.ajouter({
        title,
        author,
        category,
        date_at: dateAt,
        mediation_status: finalStatus,
      })
      toast.success(finalStatus === "published" ? "Méditation publiée" : "Brouillon enregistré")
      router.push("/dashboard/mediation")
    } catch (e) {
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
            href="/dashboard/mediation"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouvelle méditation</h1>
            <p className="text-sm text-gray-500">Ajoutez une méditation spirituelle</p>
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

      <div className="max-w-2xl">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Auteur *</label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Ex: Père Joseph"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
              />
            </div>
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
      </div>
    </div>
  )
}
