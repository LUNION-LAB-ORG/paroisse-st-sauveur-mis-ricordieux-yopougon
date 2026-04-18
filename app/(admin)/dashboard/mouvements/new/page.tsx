"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import { Card, Button, TextField, TextArea, Input, Label } from "@heroui/react"
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
              <TextField value={title} onChange={setTitle} isRequired>
                <Label>Nom du mouvement</Label>
                <Input placeholder="Ex : Chorale Sainte Cécile" />
              </TextField>
              <TextField value={description} onChange={setDescription} isRequired>
                <Label>Description courte</Label>
                <TextArea rows={3} placeholder="Une phrase ou deux qui résument le mouvement (affichée sur la liste publique)" />
              </TextField>
              <TextField value={content} onChange={setContent}>
                <Label>Présentation détaillée</Label>
                <TextArea
                  rows={10}
                  placeholder="Vocation, activités, histoire, valeurs... (affiché sur la page détail)"
                />
              </TextField>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d2d83]">Responsable & horaires</h3>

              <TextField value={leader} onChange={setLeader}>
                <Label>Responsable</Label>
                <Input placeholder="Ex : Père Joseph Kouadio" />
              </TextField>

              <TextField value={schedule} onChange={setSchedule}>
                <Label>Horaires / fréquence</Label>
                <Input placeholder="Ex : Samedi à 16h" />
              </TextField>
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
