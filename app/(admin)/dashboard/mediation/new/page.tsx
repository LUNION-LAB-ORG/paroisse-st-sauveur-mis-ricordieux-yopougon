"use client"

import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"
import {
  Button,
  Card,
  DateField,
  DatePicker,
  Calendar,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@heroui/react"
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

function toDateValue(iso: string): DateValue | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3])) : null
}
function toIso(d: DateValue | null): string {
  if (!d) return ""
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
}

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
              <TextField value={title} onChange={setTitle} isRequired>
                <Label>Titre</Label>
                <Input placeholder="Titre de la méditation" />
              </TextField>
              <TextField value={content} onChange={setContent}>
                <Label>Contenu</Label>
                <TextArea
                  rows={14}
                  placeholder="Le texte complet de la méditation (versets, commentaires, prière...)"
                />
              </TextField>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-4">
              <h3 className="font-semibold text-[#2d2d83]">Paramètres</h3>

              <TextField value={author} onChange={setAuthor} isRequired>
                <Label>Auteur</Label>
                <Input placeholder="Ex : Père Joseph Kouadio" />
              </TextField>

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
                value={toDateValue(dateAt)}
                onChange={(d) => setDateAt(toIso(d))}
              >
                <Label>Date</Label>
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
                  <Calendar>
                    <Calendar.Header>
                      <Calendar.NavButton slot="previous" />
                      <Calendar.Heading />
                      <Calendar.NavButton slot="next" />
                    </Calendar.Header>
                    <Calendar.Grid>
                      <Calendar.GridHeader>
                        {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                      </Calendar.GridHeader>
                      <Calendar.GridBody>
                        {(date) => <Calendar.Cell date={date} />}
                      </Calendar.GridBody>
                    </Calendar.Grid>
                  </Calendar>
                </DatePicker.Popover>
              </DatePicker>
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
