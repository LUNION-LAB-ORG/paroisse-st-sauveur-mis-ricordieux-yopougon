"use client"

import { ArrowLeft, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Card,
  Button,
  TextField,
  TextArea,
  Input,
  Label,
  Select,
  ListBox,
  DatePicker,
  DateField,
  Calendar as HeroCalendar,
} from "@heroui/react"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@heroui/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { actualiteAPI } from "@/features/actualite/apis/actualite.api"
import type { IActualite } from "@/features/actualite/types/actualite.type"

const CATEGORIES = ["Annonce", "Événement", "Liturgie", "Vie paroissiale", "Autre"] as const

function toDateValue(iso: string): DateValue | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3])) : null
}
function toIso(d: DateValue | null): string {
  if (!d) return ""
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
}

export default function ActualiteDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [actualite, setActualite] = useState<IActualite | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Annonce")
  const [resume, setResume] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [author, setAuthor] = useState("")
  const [status, setStatus] = useState<"published" | "draft">("draft")
  const [publishedAt, setPublishedAt] = useState<string>("")
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!id) return
    actualiteAPI
      .obtenirParId(String(id))
      .then((res) => {
        const a = res.data
        setActualite(a)
        setTitle(a.title ?? "")
        setCategory(a.category ?? "Annonce")
        setResume(a.new_resume ?? "")
        setContent(a.content ?? "")
        setLocation(a.location ?? "")
        setAuthor(a.author ?? "")
        setStatus(a.status === "published" ? "published" : "draft")
        setPublishedAt(a.published_at ? new Date(a.published_at).toISOString().slice(0, 10) : "")
      })
      .catch(() => toast.error("Impossible de charger l'article"))
      .finally(() => setLoading(false))
  }, [id])

  const save = async (finalStatus?: "published" | "draft") => {
    if (!title.trim()) {
      toast.error("Le titre est requis")
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("_method", "PUT")
      fd.append("title", title)
      fd.append("category", category)
      fd.append("new_resume", resume)
      fd.append("content", content)
      fd.append("location", location)
      fd.append("author", author)
      fd.append("new_status", finalStatus ?? status)
      if (publishedAt) fd.append("published_at", publishedAt)
      if (imageFile) fd.append("image", imageFile)

      await actualiteAPI.modifier(String(id), fd)
      toast.success("Article mis à jour")
      router.push("/dashboard/actualites")
    } catch (e) {
      console.error(e)
      const msg = e instanceof Error ? e.message : "Erreur lors de la mise à jour"
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    try {
      await actualiteAPI.supprimer(String(id))
      toast.success("Article supprimé")
      router.push("/dashboard/actualites")
    } catch (e) {
      console.error(e)
      toast.error("Erreur lors de la suppression")
    }
  }

  if (loading) {
    return <div className="text-gray-400 py-24 text-center">Chargement...</div>
  }

  if (!actualite) {
    return (
      <div className="text-gray-500 py-24 text-center">
        Article introuvable.{" "}
        <Link href="/dashboard/actualites" className="text-[#2d2d83] underline">
          Retour
        </Link>
      </div>
    )
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
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier l&apos;article</h1>
            <p className="text-sm text-gray-500">
              Dernière modification :{" "}
              {actualite.created_at
                ? new Date(actualite.created_at).toLocaleDateString("fr-FR")
                : "—"}
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
            onPress={() => save()}
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
                <Label>Titre</Label>
                <Input />
              </TextField>
              <TextField value={resume} onChange={setResume}>
                <Label>Résumé</Label>
                <TextArea rows={2} />
              </TextField>
              <TextField value={content} onChange={setContent}>
                <Label>Contenu</Label>
                <TextArea rows={10} />
              </TextField>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d2d83]">Paramètres</h3>

              <Select
                selectedKey={category}
                onSelectionChange={(k) => setCategory(String(k))}
              >
                <Label>Catégorie</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    {CATEGORIES.map((c) => (
                      <ListBox.Item key={c} id={c} textValue={c}>{c}</ListBox.Item>
                    ))}
                  </ListBox>
                </Select.Popover>
              </Select>

              <Select
                selectedKey={status}
                onSelectionChange={(k) => setStatus(String(k) as "published" | "draft")}
              >
                <Label>Statut</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="published" textValue="Publié">Publié</ListBox.Item>
                    <ListBox.Item id="draft" textValue="Brouillon">Brouillon</ListBox.Item>
                  </ListBox>
                </Select.Popover>
              </Select>

              <DatePicker
                value={toDateValue(publishedAt)}
                onChange={(d) => setPublishedAt(toIso(d))}
              >
                <Label>Date de publication</Label>
                <DateField.Group fullWidth>
                  <DateField.Input>
                    {(segment) => <DateField.Segment segment={segment} />}
                  </DateField.Input>
                  <DateField.Suffix>
                    <DatePicker.Trigger>
                      <DatePicker.TriggerIndicator />
                    </DatePicker.Trigger>
                  </DateField.Suffix>
                </DateField.Group>
                <DatePicker.Popover>
                  <HeroCalendar>
                    <HeroCalendar.Header>
                      <HeroCalendar.NavButton slot="previous" />
                      <HeroCalendar.Heading />
                      <HeroCalendar.NavButton slot="next" />
                    </HeroCalendar.Header>
                    <HeroCalendar.Grid>
                      <HeroCalendar.GridHeader>
                        {(day) => <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>}
                      </HeroCalendar.GridHeader>
                      <HeroCalendar.GridBody>
                        {(date) => <HeroCalendar.Cell date={date} />}
                      </HeroCalendar.GridBody>
                    </HeroCalendar.Grid>
                  </HeroCalendar>
                </DatePicker.Popover>
              </DatePicker>

              <TextField value={location} onChange={setLocation}>
                <Label>Lieu</Label>
                <Input />
              </TextField>

              <TextField value={author} onChange={setAuthor}>
                <Label>Auteur</Label>
                <Input />
              </TextField>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <ImageUploadField
                initialImageUrl={actualite.image ?? null}
                onChange={setImageFile}
                title="Image principale"
              />
            </Card.Content>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer cet article ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            Cette action est irréversible. L&apos;article sera définitivement supprimé.
          </p>
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
