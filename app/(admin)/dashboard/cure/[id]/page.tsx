"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Edit, User, Calendar, Save, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { Card, Avatar, Chip, Separator, TextField, Label, Input as HeroInput, TextArea as HeroTextArea } from "@heroui/react"
import { Button as HeroButton } from "@heroui/react"
import { Input } from "@/components/ui/input"
import { cureAPI } from "@/features/cure/apis/cure.api"
import type { ICure } from "@/features/cure/types/cure.type"

function formatDate(iso: string | null) {
  if (!iso) return null
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
  } catch { return iso }
}

export default function CureDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
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
      const payload: Record<string, unknown> = {
        fullname: form.fullname,
        started_at: form.started_at,
        ended_at: form.ended_at || null,
        description: form.description,
      }
      if (file) payload.photo = file
      const res = await cureAPI.modifier(String(cure.id), payload)
      setCure(res as unknown as ICure)
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
      const payload = isActive
        ? { ended_at: new Date().toISOString().slice(0, 10) }
        : { ended_at: null }
      const res = await cureAPI.modifier(String(cure.id), payload)
      setCure(res as unknown as ICure)
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
        {/* Photo header */}
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
            /* ---- VIEW MODE ---- */
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
                {cure.ended_at ? "↩ Remettre en poste" : "✓ Marquer comme ancien"}
              </HeroButton>
            </div>
          ) : (
            /* ---- EDIT MODE ---- */
            <div className="space-y-4">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <label className="flex items-center gap-3 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-[#2d2d83]/30 transition-colors">
                  <User className="w-8 h-8 text-gray-300 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">{file ? file.name : "Changer la photo"}</p>
                    <p className="text-xs text-gray-400">JPG, PNG (max 2MB)</p>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files && setFile(e.target.files[0])} />
                </label>
              </div>

              <TextField value={form.fullname} onChange={(v) => setForm((p) => ({ ...p, fullname: v }))}>
                <Label>Nom complet</Label>
                <HeroInput placeholder="Père Jean-Baptiste KOFFI" />
              </TextField>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début de ministère</label>
                  <Input type="date" value={form.started_at} onChange={(e) => setForm((p) => ({ ...p, started_at: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin (vide si en cours)</label>
                  <Input type="date" value={form.ended_at} onChange={(e) => setForm((p) => ({ ...p, ended_at: e.target.value }))} />
                </div>
              </div>

              <TextField value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))}>
                <Label>Description / Biographie</Label>
                <HeroTextArea rows={4} placeholder="Biographie courte du curé..." />
              </TextField>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  )
}
