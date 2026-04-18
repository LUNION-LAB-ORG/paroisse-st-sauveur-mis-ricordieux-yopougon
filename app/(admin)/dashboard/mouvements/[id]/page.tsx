"use client"

import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, Button, TextField, TextArea, Input, Label } from "@heroui/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { serviceAPI } from "@/features/service/apis/service.api"
import type { IService } from "@/features/service/types/service.type"

export default function MouvementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [service, setService] = useState<IService | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [leader, setLeader] = useState("")
  const [schedule, setSchedule] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!id) return
    serviceAPI
      .obtenirUn(id)
      .then((res) => {
        const s = res.data
        setService(s)
        setTitle(s.title ?? "")
        setDescription(s.description ?? "")
        setContent(s.content ?? "")
        setLeader(s.leader ?? "")
        setSchedule(s.schedule ?? "")
      })
      .catch(() => toast.error("Impossible de charger le mouvement"))
      .finally(() => setLoading(false))
  }, [id])

  const save = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Titre et description sont obligatoires")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("_method", "PUT")
      fd.append("title", title)
      fd.append("description", description)
      fd.append("content", content)
      fd.append("leader", leader)
      fd.append("schedule", schedule)
      if (imageFile) fd.append("image", imageFile)

      await serviceAPI.modifier(String(id), fd)
      toast.success("Mouvement mis à jour")
      router.push("/dashboard/mouvements")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    try {
      await serviceAPI.supprimer(Number(id))
      toast.success("Mouvement supprimé")
      router.push("/dashboard/mouvements")
    } catch {
      toast.error("Erreur lors de la suppression")
    }
  }

  if (loading) return <div className="text-gray-400 py-24 text-center">Chargement...</div>
  if (!service)
    return (
      <div className="text-gray-500 py-24 text-center">
        Mouvement introuvable.{" "}
        <Link href="/dashboard/mouvements" className="text-[#2d2d83] underline">
          Retour
        </Link>
      </div>
    )

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
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier le mouvement</h1>
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
              <TextField value={title} onChange={setTitle} isRequired>
                <Label>Nom du mouvement</Label>
                <Input />
              </TextField>
              <TextField value={description} onChange={setDescription} isRequired>
                <Label>Description courte</Label>
                <TextArea rows={3} />
              </TextField>
              <TextField value={content} onChange={setContent}>
                <Label>Présentation détaillée</Label>
                <TextArea rows={12} />
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
                <Input />
              </TextField>

              <TextField value={schedule} onChange={setSchedule}>
                <Label>Horaires / fréquence</Label>
                <Input />
              </TextField>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <ImageUploadField
                initialImageUrl={service.image ?? null}
                onChange={setImageFile}
                title="Image du mouvement"
              />
            </Card.Content>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce mouvement ?</DialogTitle>
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
