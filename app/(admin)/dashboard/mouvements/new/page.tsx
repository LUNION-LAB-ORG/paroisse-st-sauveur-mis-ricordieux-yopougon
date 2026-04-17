"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Card, Button } from "@heroui/react"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { serviceAPI } from "@/features/service/apis/service.api"

export default function NouveauMouvementPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [leader, setLeader] = useState("")
  const [schedule, setSchedule] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const submit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Titre et description sont obligatoires.")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("title", title)
      fd.append("description", description)
      if (content.trim()) fd.append("content", content)
      if (leader.trim()) fd.append("leader", leader)
      if (schedule.trim()) fd.append("schedule", schedule)
      if (imageFile) fd.append("image", imageFile)

      await serviceAPI.ajouter(fd)
      toast.success("Mouvement créé")
      router.push("/dashboard/mouvements")
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
            href="/dashboard/mouvements"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Nouveau mouvement</h1>
            <p className="text-sm text-gray-500">Présentez un groupe ou mouvement paroissial</p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du mouvement *</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex : Chorale Sainte Cécile"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description courte *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Une phrase ou deux qui résument le mouvement (affichée sur la liste publique)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Présentation détaillée</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  placeholder="Vocation, activités, histoire, valeurs... (affiché sur la page détail)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 leading-relaxed"
                />
              </div>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d2d83]">Responsable & horaires</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Responsable</label>
                <input
                  value={leader}
                  onChange={(e) => setLeader(e.target.value)}
                  placeholder="Ex : Père Joseph Kouadio"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Horaires / fréquence</label>
                <input
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Ex : Samedi à 16h"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <ImageUploadField onChange={setImageFile} title="Image du mouvement" />
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
