"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Church, Clock, Globe, ImageIcon, Save, Loader2 } from "lucide-react"
import { Header } from "@/components/admin/header"
import { Card, Button } from "@heroui/react"
import { ImageUploadField } from "@/components/admin/image-upload-field"
import { settingAPI } from "@/features/setting/apis/setting.api"
import { invalidateSettingsCache } from "@/features/setting/hooks/useSettings"
import type { ISettingsGrouped } from "@/features/setting/types/setting.type"

const GROUPS_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
> = {
  parish: { label: "Informations de la paroisse", icon: Church, color: "text-[#2d2d83]" },
  social: { label: "Réseaux sociaux", icon: Globe, color: "text-[#98141f]" },
  images: { label: "Identité visuelle", icon: ImageIcon, color: "text-amber-600" },
  hours: { label: "Horaires", icon: Clock, color: "text-green-600" },
}

export default function ParametresPage() {
  const [grouped, setGrouped] = useState<ISettingsGrouped>({})
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)

  const load = async () => {
    try {
      const res = await settingAPI.obtenirGroupes()
      setGrouped(res.data ?? {})
      const flat: Record<string, string> = {}
      Object.values(res.data ?? {}).forEach((items) => {
        items.forEach((s) => {
          flat[s.key] = s.value ?? ""
        })
      })
      setValues(flat)
    } catch {
      toast.error("Erreur lors du chargement des paramètres")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const orderedGroups = useMemo(
    () => ["parish", "social", "images", "hours"].filter((g) => grouped[g]),
    [grouped],
  )

  const setValue = (key: string, v: string) => setValues((prev) => ({ ...prev, [key]: v }))

  const saveAll = async () => {
    setSaving(true)
    try {
      const payload: { key: string; value: string | null }[] = []
      Object.values(grouped).forEach((items) => {
        items.forEach((s) => {
          if (s.type !== "image") {
            payload.push({ key: s.key, value: values[s.key] ?? "" })
          }
        })
      })
      await settingAPI.modifier(payload)
      invalidateSettingsCache()
      toast.success("Paramètres enregistrés")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const uploadImage = async (key: string, file: File | null) => {
    if (!file) return
    setUploadingKey(key)
    try {
      const res = await settingAPI.uploadImage(key, file)
      setValues((prev) => ({ ...prev, [key]: res.data.value }))
      invalidateSettingsCache()
      toast.success("Image mise à jour")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur d'upload")
    } finally {
      setUploadingKey(null)
    }
  }

  if (loading) {
    return (
      <div>
        <Header title="Paramètres" />
        <div className="flex items-center justify-center py-24 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Chargement...
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Paramètres" />

      <div className="flex justify-end mb-6">
        <Button
          variant="primary"
          isDisabled={saving}
          onPress={saveAll}
          className="bg-[#98141f] rounded-xl"
        >
          <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>

      <div className="space-y-6">
        {orderedGroups.map((g) => {
          const items = grouped[g]
          const meta = GROUPS_META[g] ?? { label: g, icon: Church, color: "text-gray-500" }
          const Icon = meta.icon
          return (
            <Card key={g}>
              <Card.Header className="px-6 pt-6 pb-3">
                <Card.Title className={`text-base font-semibold flex items-center gap-2 ${meta.color}`}>
                  <Icon className="w-5 h-5" /> {meta.label}
                </Card.Title>
              </Card.Header>
              <Card.Content className="p-6 pt-0">
                <div className="grid gap-5 sm:grid-cols-2">
                  {items.map((s) => {
                    if (s.type === "image") {
                      return (
                        <div key={s.key}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {s.label ?? s.key}
                          </label>
                          <ImageUploadField
                            initialImageUrl={values[s.key] || null}
                            onChange={(file) => uploadImage(s.key, file)}
                            title={uploadingKey === s.key ? "Upload en cours..." : s.label ?? s.key}
                          />
                        </div>
                      )
                    }
                    if (s.type === "textarea") {
                      return (
                        <div key={s.key} className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {s.label ?? s.key}
                          </label>
                          <textarea
                            value={values[s.key] ?? ""}
                            onChange={(e) => setValue(s.key, e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                          />
                        </div>
                      )
                    }
                    const inputType =
                      s.type === "email"
                        ? "email"
                        : s.type === "url"
                          ? "url"
                          : s.type === "phone"
                            ? "tel"
                            : "text"
                    return (
                      <div key={s.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {s.label ?? s.key}
                        </label>
                        <input
                          type={inputType}
                          value={values[s.key] ?? ""}
                          onChange={(e) => setValue(s.key, e.target.value)}
                          placeholder={s.label ?? ""}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                        />
                      </div>
                    )
                  })}
                </div>
              </Card.Content>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          variant="primary"
          isDisabled={saving}
          onPress={saveAll}
          className="bg-[#98141f] rounded-xl"
        >
          <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  )
}
