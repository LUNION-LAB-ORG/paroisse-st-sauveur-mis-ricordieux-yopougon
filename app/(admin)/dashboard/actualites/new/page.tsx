"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
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
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { actualiteAPI } from "@/features/actualite/apis/actualite.api"

const CATEGORIES = ["Annonce", "Événement", "Liturgie", "Vie paroissiale", "Autre"] as const

function toDateValue(iso: string): DateValue | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3])) : null
}
function toIso(d: DateValue | null): string {
  if (!d) return ""
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
}

export default function NouvelArticlePage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<string>("Annonce")
  const [resume, setResume] = useState("")
  const [content, setContent] = useState("")
  const [location, setLocation] = useState("")
  const [author, setAuthor] = useState("")
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
              <TextField value={title} onChange={setTitle} isRequired>
                <Label>Titre</Label>
                <Input placeholder="Titre de l'article" />
              </TextField>
              <TextField value={resume} onChange={setResume} isRequired>
                <Label>Résumé</Label>
                <TextArea rows={2} placeholder="Un court résumé (affiché sur la liste)" />
              </TextField>
              <TextField value={content} onChange={setContent} isRequired>
                <Label>Contenu</Label>
                <TextArea rows={10} placeholder="Contenu détaillé de l'article" />
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

              <TextField value={location} onChange={setLocation} isRequired>
                <Label>Lieu</Label>
                <Input placeholder="Ex: Église paroissiale" />
              </TextField>

              <TextField value={author} onChange={setAuthor} isRequired>
                <Label>Auteur</Label>
                <Input placeholder="Ex: Père Joseph" />
              </TextField>
            </Card.Content>
          </Card>

          <Card>
            <Card.Content className="p-6">
              <ImageUploadField onChange={setImageFile} title="Image principale" />
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  )
}
