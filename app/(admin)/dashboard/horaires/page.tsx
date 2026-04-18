"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { Card, Button, Chip, Switch } from "@heroui/react"
import { Clock, Plus, Trash2, Edit, Users } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { timeSlotAPI } from "@/features/time-slot/apis/time-slot.api"
import {
  ITimeSlot,
  ITimeSlotType,
  TIME_SLOT_TYPES,
  WEEKDAYS_FR,
} from "@/features/time-slot/types/time-slot.type"

interface SlotFormState {
  type: ITimeSlotType
  weekday: number
  start_time: string
  end_time: string
  capacity: string
  notes: string
  is_available: boolean
}

const EMPTY_FORM: SlotFormState = {
  type: "messe",
  weekday: 0,
  start_time: "09:00",
  end_time: "10:00",
  capacity: "",
  notes: "",
  is_available: true,
}

export default function HorairesPage() {
  const [slots, setSlots] = useState<ITimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<string>("all")

  // Modale create / edit
  const [open, setOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<ITimeSlot | null>(null)
  const [form, setForm] = useState<SlotFormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  // Modale delete
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    try {
      const res = await timeSlotAPI.obtenirTous({ per_page: "100" })
      const items = (res.data ?? []) as ITimeSlot[]
      // Tri par type puis weekday puis start_time
      items.sort((a, b) => {
        if (a.type !== b.type) return a.type.localeCompare(b.type)
        if (a.weekday !== b.weekday) return a.weekday - b.weekday
        return a.start_time.localeCompare(b.start_time)
      })
      setSlots(items)
    } catch {
      toast.error("Erreur lors du chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return slots.filter((s) => filterType === "all" || s.type === filterType)
  }, [slots, filterType])

  const counts = useMemo(() => {
    const map: Record<string, number> = {}
    for (const s of slots) map[s.type] = (map[s.type] ?? 0) + 1
    return map
  }, [slots])

  const openCreate = () => {
    setEditingSlot(null)
    setForm(EMPTY_FORM)
    setOpen(true)
  }

  const openEdit = (slot: ITimeSlot) => {
    setEditingSlot(slot)
    setForm({
      type: (slot.type as ITimeSlotType) ?? "ecoute",
      weekday: slot.weekday,
      start_time: slot.start_time?.slice(0, 5) ?? "09:00",
      end_time: slot.end_time?.slice(0, 5) ?? "10:00",
      capacity: slot.capacity ? String(slot.capacity) : "",
      notes: slot.notes ?? "",
      is_available: slot.is_available,
    })
    setOpen(true)
  }

  const save = async () => {
    if (!form.start_time || !form.end_time) {
      toast.error("Renseignez les horaires de début et fin.")
      return
    }
    if (form.start_time >= form.end_time) {
      toast.error("L'heure de fin doit être après l'heure de début.")
      return
    }
    setSaving(true)
    try {
      const payload = {
        type: form.type,
        weekday: form.weekday,
        start_time: form.start_time,
        end_time: form.end_time,
        capacity: form.capacity ? Number(form.capacity) : null,
        notes: form.notes || null,
        is_available: form.is_available,
      }
      if (editingSlot) {
        const res = await timeSlotAPI.modifier(editingSlot.id, payload)
        setSlots((prev) => prev.map((s) => (s.id === editingSlot.id ? res.data : s)))
        toast.success("Créneau mis à jour")
      } else {
        const res = await timeSlotAPI.ajouter(payload)
        setSlots((prev) => [...prev, res.data])
        toast.success("Créneau créé")
      }
      setOpen(false)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur lors de l'enregistrement")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await timeSlotAPI.supprimer(deleteId)
      setSlots((prev) => prev.filter((s) => s.id !== deleteId))
      toast.success("Créneau supprimé")
      setDeleteId(null)
    } catch {
      toast.error("Erreur")
    } finally {
      setDeleting(false)
    }
  }

  const toggleAvailable = async (slot: ITimeSlot) => {
    try {
      const res = await timeSlotAPI.modifier(slot.id, { is_available: !slot.is_available })
      setSlots((prev) => prev.map((s) => (s.id === slot.id ? res.data : s)))
    } catch {
      toast.error("Erreur")
    }
  }

  return (
    <div>
      <Header title="Horaires & Créneaux" />

      <p className="text-sm text-gray-500 mb-6 max-w-3xl">
        Définissez les créneaux récurrents disponibles pour les messes, écoutes, confessions, etc.
        Les fidèles ne pourront sélectionner que ces horaires lors de leurs demandes.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        {TIME_SLOT_TYPES.map((t) => (
          <StatCard
            key={t.value}
            icon={Clock}
            value={String(counts[t.value] ?? 0)}
            label={t.label}
            iconBgColor={t.color.split(" ")[0]}
            iconColor={t.color.split(" ")[1]}
          />
        ))}
      </div>

      {/* Filtres + add */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-wrap flex-1">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filterType === "all" ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tous ({slots.length})
          </button>
          {TIME_SLOT_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filterType === t.value ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t.label} ({counts[t.value] ?? 0})
            </button>
          ))}
        </div>

        <Button variant="primary" className="bg-[#98141f] rounded-xl" onPress={openCreate}>
          <Plus className="w-4 h-4" /> Nouveau créneau
        </Button>
      </div>

      {/* Liste */}
      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}
      {!loading && filtered.length === 0 && (
        <Card className="p-12">
          <Card.Content className="text-center">
            <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun créneau pour ce filtre.</p>
          </Card.Content>
        </Card>
      )}
      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((slot) => {
            const meta = TIME_SLOT_TYPES.find((t) => t.value === slot.type)
            const day = WEEKDAYS_FR.find((w) => w.value === slot.weekday)
            return (
              <Card
                key={slot.id}
                className={`hover:shadow-sm transition-shadow ${!slot.is_available ? "opacity-60" : ""}`}
              >
                <Card.Content className="p-4 flex items-center gap-4 flex-wrap">
                  <div className="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-[#2d2d83]/5 text-[#2d2d83] shrink-0">
                    <span className="text-[10px] uppercase font-semibold">{day?.short ?? "?"}</span>
                    <span className="text-sm font-bold mt-0.5">{slot.start_time?.slice(0, 5)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <Chip variant="soft" color="default" size="sm">
                        {meta?.label ?? slot.type}
                      </Chip>
                      {slot.capacity && (
                        <Chip variant="soft" color="accent" size="sm">
                          <Users className="w-3 h-3 mr-1" /> {slot.capacity} places
                        </Chip>
                      )}
                      {!slot.is_available && (
                        <Chip variant="soft" color="danger" size="sm">
                          Désactivé
                        </Chip>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800">
                      {day?.long} • {slot.start_time?.slice(0, 5)} – {slot.end_time?.slice(0, 5)}
                    </p>
                    {slot.notes && <p className="text-xs text-gray-500 mt-0.5">{slot.notes}</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      isSelected={slot.is_available}
                      onChange={() => toggleAvailable(slot)}
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-lg text-[#2d2d83] hover:bg-[#2d2d83]/10"
                      onPress={() => openEdit(slot)}
                      aria-label="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-lg text-red-500 hover:bg-red-50"
                      onPress={() => setDeleteId(slot.id)}
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            )
          })}
        </div>
      )}

      {/* Create / Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">
              {editingSlot ? "Modifier le créneau" : "Nouveau créneau"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as ITimeSlotType }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
              >
                {TIME_SLOT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jour de la semaine *</label>
              <select
                value={form.weekday}
                onChange={(e) => setForm((f) => ({ ...f, weekday: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
              >
                {WEEKDAYS_FR.map((w) => (
                  <option key={w.value} value={w.value}>{w.long}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                <input
                  type="time"
                  value={form.end_time}
                  onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacité <span className="text-gray-400 text-xs">(vide = illimitée)</span>
              </label>
              <input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
                placeholder="Ex : 2 pour des créneaux d'écoute individuels"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Ex : Messe dominicale animée par la chorale"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
              />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Switch
                isSelected={form.is_available}
                onChange={(v) => setForm((f) => ({ ...f, is_available: !!v }))}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
              <span className="text-sm text-gray-700">
                {form.is_available ? "Créneau disponible aux fidèles" : "Créneau désactivé (caché du public)"}
              </span>
            </div>

            <button
              onClick={save}
              disabled={saving}
              className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-60"
            >
              {saving ? "Enregistrement..." : editingSlot ? "Mettre à jour" : "Créer le créneau"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer ce créneau ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Cette action est irréversible. Les futures demandes ne pourront plus utiliser ce créneau.
          </p>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setDeleteId(null)}>
              Annuler
            </Button>
            <Button variant="primary" className="bg-red-600" isDisabled={deleting} onPress={remove}>
              {deleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
