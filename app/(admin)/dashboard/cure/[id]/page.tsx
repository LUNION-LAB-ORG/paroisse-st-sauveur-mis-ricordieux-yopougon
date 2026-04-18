"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Edit, Calendar, Save, X } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Card,
  Avatar,
  Chip,
  Separator,
  TextField,
  Label,
  Input,
  TextArea,
  DatePicker,
  DateField,
  Calendar as HeroCalendar,
  Button as HeroButton,
} from "@heroui/react"
import { CalendarDate } from "@internationalized/date"
import type { DateValue } from "@heroui/react"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { cureAPI } from "@/features/cure/apis/cure.api"
import type { ICure } from "@/features/cure/types/cure.type"

function formatDate(iso: string | null) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
  } catch { return iso }
}

function toDateValue(iso: string): DateValue | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3])) : null
}
function toIso(d: DateValue | null): string {
  if (!d) return ""
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
}

export default function CureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [cure, setCure] = useState<ICure | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const [form, setForm] = useState({
    fullname: "",
    started_at: "",
    ended_at: "",
    description: "",
  })

  useEffect(() => {
    cureAPI
      .obtenirTous()
      .then((res) => {
        const found = (res.data ?? []).find((c: ICure) => String(c.id) === id)
        if (found) {
          setCure(found)
          setForm({
            fullname: found.fullname,
            started_at: found.started_at ?? "",
            ended_at: found.ended_at ?? "",
            description: found.description ?? "",
          })
        }
      })
      .catch(() => toast.error("Erreur de chargement"))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async () => {
    if (!cure) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append("_method", "PUT")
      fd.append("fullname", form.fullname)
      fd.append("started_at", form.started_at)
      if (form.ended_at) fd.append("ended_at", form.ended_at)
      fd.append("description", form.description)
      if (file) fd.append("photo", file)

      const res = await cureAPI.modifier(String(cure.id), fd)
      const updated = (res as unknown as { data?: ICure }).data ?? (res as unknown as ICure)
      setCure(updated)
      toast.success("Curé mis à jour")
      setEditing(false)
      setFile(null)
    } catch {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  const toggleEnPoste = async () => {
    if (!cure) return
    const isActive = !cure.ended_at
    try {
      const fd = new FormData()
      fd.append("_method", "PUT")
      fd.append("fullname", cure.fullname)
      fd.append("started_at", cure.started_at ?? "")
      fd.append("description", cure.description ?? "")
      if (isActive) fd.append("ended_at", new Date().toISOString().slice(0, 10))
      const res = await cureAPI.modifier(String(cure.id), fd)
      const updated = (res as unknown as { data?: ICure }).data ?? (res as unknown as ICure)
      setCure(updated)
      toast.success(isActive ? "Marqué comme ancien curé" : "Remis en poste")
    } catch {
      toast.error("Erreur lors de la mise à jour")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  if (!cure) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-gray-500">Curé introuvable.</p>
        <Link href="/dashboard/cure" className="text-[#2d2d83] hover:underline text-sm">
          Retour à la liste
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link href="/dashboard/cure" className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2d2d83]">
          <ArrowLeft className="w-4 h-4" /> Retour
        </Link>
        <div className="flex gap-2">
          {!editing ? (
            <HeroButton
              variant="outline"
              className="rounded-xl text-[#2d2d83] border-[#2d2d83]/20"
              onPress={() => setEditing(true)}
            >
              <Edit className="w-4 h-4" /> Modifier
            </HeroButton>
          ) : (
            <>
              <HeroButton
                variant="ghost"
                className="rounded-xl text-gray-500"
                onPress={() => { setEditing(false); setFile(null) }}
              >
                <X className="w-4 h-4" /> Annuler
              </HeroButton>
              <HeroButton
                variant="primary"
                className="rounded-xl bg-[#2d2d83]"
                isDisabled={saving}
                onPress={handleSave}
              >
                <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer"}
              </HeroButton>
            </>
          )}
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="relative h-40 bg-gradient-to-br from-[#2d2d83] to-[#98141f]">
          <div className="absolute top-3 right-3">
            <Chip variant="soft" color={cure.ended_at ? "default" : "success"} size="sm">
              {cure.ended_at ? "Ancien" : "En poste"}
            </Chip>
          </div>
          <div className="absolute -bottom-12 left-8">
            <Avatar className="w-24 h-24 ring-4 ring-white">
              <Avatar.Image src={cure.photo || "/avatar-placeholder.png"} alt={cure.fullname} />
              <Avatar.Fallback className="bg-[#2d2d83] text-white text-2xl">
                {cure.fullname?.charAt(0) || "?"}
              </Avatar.Fallback>
            </Avatar>
          </div>
        </div>

        <Card.Content className="pt-16 pb-6 px-6">
          {!editing ? (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold text-[#2d2d83]">{cure.fullname}</h1>
                <p className="text-sm text-[#98141f] font-medium mt-1">Curé de la paroisse</p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#2d2d83]" />
                  Début : {formatDate(cure.started_at) ?? "—"}
                </span>
                {cure.ended_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    Fin : {formatDate(cure.ended_at)}
                  </span>
                )}
              </div>

              {cure.description && (
                <p className="text-gray-600 leading-relaxed">{cure.description}</p>
              )}

              <Separator />

              <HeroButton
                variant="ghost"
                className={`w-full rounded-xl text-sm ${cure.ended_at ? "text-green-700 bg-green-50 hover:bg-green-100" : "text-gray-600 bg-gray-50 hover:bg-gray-100"}`}
                onPress={toggleEnPoste}
              >
                {cure.ended_at ? "Remettre en poste" : "Marquer comme ancien"}
              </HeroButton>
            </div>
          ) : (
            <div className="space-y-4">
              <ImageUploadField
                initialImageUrl={cure.photo ?? null}
                onChange={setFile}
                title="Photo"
                height={140}
              />

              <TextField
                value={form.fullname}
                onChange={(v) => setForm((p) => ({ ...p, fullname: v }))}
                isRequired
              >
                <Label>Nom complet</Label>
                <Input placeholder="Père Jean-Baptiste KOFFI" />
              </TextField>

              <div className="grid grid-cols-2 gap-3">
                <DatePicker
                  value={toDateValue(form.started_at)}
                  onChange={(d) => setForm((p) => ({ ...p, started_at: toIso(d) }))}
                >
                  <Label>Début de ministère</Label>
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

                <DatePicker
                  value={toDateValue(form.ended_at)}
                  onChange={(d) => setForm((p) => ({ ...p, ended_at: toIso(d) }))}
                >
                  <Label>Fin (vide si en cours)</Label>
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
              </div>

              <TextField
                value={form.description}
                onChange={(v) => setForm((p) => ({ ...p, description: v }))}
              >
                <Label>Description / Biographie</Label>
                <TextArea rows={4} placeholder="Biographie courte du curé..." />
              </TextField>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
