"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import {
  Button,
  Card,
  Switch,
  Select,
  ListBox,
  Label,
  TextField,
  Input,
  TimeField,
  NumberField,
} from "@heroui/react"
import { Time } from "@internationalized/date"
import type { TimeValue } from "@heroui/react"
import { Trash2, Check, X } from "lucide-react"
import { Header } from "@/components/admin/header"
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

/* ============ Helpers ============ */

/** Extrait minutes depuis minuit (0-1439) d'une chaîne horaire */
function parseTimeToMinutes(value?: string | null): number {
  if (!value) return 0
  const m = /^(\d{2}):(\d{2})/.exec(value)
  if (m) return Number(m[1]) * 60 + Number(m[2])
  const d = new Date(value)
  if (!isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes()
  return 0
}

function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
}

const TYPE_COLORS: Record<ITimeSlotType, { bg: string; border: string; text: string; solid: string }> = {
  messe:      { bg: "bg-[#2d2d83]/15", border: "border-[#2d2d83]/40", text: "text-[#2d2d83]", solid: "bg-[#2d2d83]" },
  ecoute:     { bg: "bg-[#98141f]/15", border: "border-[#98141f]/40", text: "text-[#98141f]", solid: "bg-[#98141f]" },
  confession: { bg: "bg-amber-100",    border: "border-amber-300",    text: "text-amber-700",  solid: "bg-amber-500" },
  adoration:  { bg: "bg-indigo-100",   border: "border-indigo-300",   text: "text-indigo-700", solid: "bg-indigo-500" },
  autre:      { bg: "bg-gray-100",     border: "border-gray-300",     text: "text-gray-700",   solid: "bg-gray-500" },
}

const HOUR_START = 5  // 05:00
const HOUR_END = 22   // 22:00 (exclusif)
const HOUR_HEIGHT = 48 // px per hour
const SLOT_MIN_MINUTES = 15 // snap to 15min increments

/* ============ Component ============ */

interface DraftSlot {
  day: number
  startMinutes: number
  endMinutes: number
}

export default function HorairesCalendarPage() {
  const [slots, setSlots] = useState<ITimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  // Visible types (toggle filters)
  const [visibleTypes, setVisibleTypes] = useState<Record<ITimeSlotType, boolean>>({
    messe: true,
    ecoute: true,
    confession: true,
    adoration: true,
    autre: true,
  })

  // Draft (pendant drag)
  const [draft, setDraft] = useState<DraftSlot | null>(null)
  const [dragDay, setDragDay] = useState<number | null>(null)
  const [dragStart, setDragStart] = useState<number | null>(null)

  // Modal new/edit
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ITimeSlot | null>(null)
  const [newRange, setNewRange] = useState<DraftSlot | null>(null)

  // Form state
  const [formType, setFormType] = useState<ITimeSlotType>("messe")
  const [formStartTime, setFormStartTime] = useState("09:00")
  const [formEndTime, setFormEndTime] = useState("10:00")
  const [formDay, setFormDay] = useState(0)
  const [formCapacity, setFormCapacity] = useState("")
  const [formNotes, setFormNotes] = useState("")
  const [formAvailable, setFormAvailable] = useState(true)
  const [saving, setSaving] = useState(false)

  // Delete
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const gridRef = useRef<HTMLDivElement>(null)

  /* ---------- Load slots ---------- */
  const load = async () => {
    try {
      const res = await timeSlotAPI.obtenirTous({ per_page: "200" })
      setSlots((res.data ?? []) as ITimeSlot[])
    } catch {
      toast.error("Erreur chargement horaires")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  /* ---------- Derived ---------- */
  const hours = useMemo(() => {
    const arr: number[] = []
    for (let h = HOUR_START; h < HOUR_END; h++) arr.push(h)
    return arr
  }, [])

  /**
   * Pour chaque jour, calcule pour chaque slot sa colonne et le nombre total
   * de colonnes du groupe de chevauchement, pour que les plages qui se chevauchent
   * partagent la largeur de la cellule au lieu de se masquer.
   */
  const slotsByDay = useMemo(() => {
    const byDay: Record<
      number,
      { slot: ITimeSlot; col: number; cols: number }[]
    > = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] }

    for (let day = 0; day < 7; day++) {
      const daySlots = slots.filter(
        (s) =>
          s.weekday === day && visibleTypes[(s.type as ITimeSlotType) ?? "autre"],
      )
      // Tri par début, puis fin descendant (priorité aux longues)
      daySlots.sort((a, b) => {
        const aStart = parseTimeToMinutes(a.start_time)
        const bStart = parseTimeToMinutes(b.start_time)
        if (aStart !== bStart) return aStart - bStart
        return parseTimeToMinutes(b.end_time) - parseTimeToMinutes(a.end_time)
      })

      // Algo : grouper en clusters de chevauchement, puis assigner colonnes
      let cluster: ITimeSlot[] = []
      let clusterEnd = -1
      const flushCluster = () => {
        if (cluster.length === 0) return
        // Greedy column assignment
        const cols: ITimeSlot[][] = []
        for (const s of cluster) {
          let placed = false
          for (let c = 0; c < cols.length; c++) {
            const lastInCol = cols[c][cols[c].length - 1]
            if (parseTimeToMinutes(lastInCol.end_time) <= parseTimeToMinutes(s.start_time)) {
              cols[c].push(s)
              byDay[day].push({ slot: s, col: c, cols: 0 /* set later */ })
              placed = true
              break
            }
          }
          if (!placed) {
            cols.push([s])
            byDay[day].push({ slot: s, col: cols.length - 1, cols: 0 })
          }
        }
        const total = cols.length
        // Attribuer "cols=total" aux derniers entries
        for (let i = byDay[day].length - cluster.length; i < byDay[day].length; i++) {
          byDay[day][i].cols = total
        }
        cluster = []
        clusterEnd = -1
      }

      for (const s of daySlots) {
        const start = parseTimeToMinutes(s.start_time)
        const end = parseTimeToMinutes(s.end_time)
        if (cluster.length === 0 || start < clusterEnd) {
          cluster.push(s)
          clusterEnd = Math.max(clusterEnd, end)
        } else {
          flushCluster()
          cluster.push(s)
          clusterEnd = end
        }
      }
      flushCluster()
    }

    return byDay
  }, [slots, visibleTypes])

  /* ---------- Mouse handlers for create ---------- */
  const getMinutesFromY = (clientY: number, columnEl: HTMLElement): number => {
    const rect = columnEl.getBoundingClientRect()
    const relativeY = clientY - rect.top
    const hourFloat = relativeY / HOUR_HEIGHT
    const minutesTotal = (HOUR_START + hourFloat) * 60
    // Snap to 15min
    const snapped = Math.round(minutesTotal / SLOT_MIN_MINUTES) * SLOT_MIN_MINUTES
    return Math.max(HOUR_START * 60, Math.min(HOUR_END * 60, snapped))
  }

  const onColumnMouseDown = (day: number, e: React.MouseEvent<HTMLDivElement>) => {
    // Only create on empty area (not on a slot block)
    if ((e.target as HTMLElement).closest("[data-slot-block]")) return
    const col = e.currentTarget
    const minutes = getMinutesFromY(e.clientY, col)
    setDragDay(day)
    setDragStart(minutes)
    setDraft({ day, startMinutes: minutes, endMinutes: minutes + 30 })
  }

  const onColumnMouseMove = (day: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (dragDay !== day || dragStart === null) return
    const col = e.currentTarget
    const minutes = getMinutesFromY(e.clientY, col)
    const start = Math.min(dragStart, minutes)
    const end = Math.max(dragStart, minutes, dragStart + SLOT_MIN_MINUTES)
    setDraft({ day, startMinutes: start, endMinutes: end })
  }

  const onColumnMouseUp = (day: number) => {
    if (dragDay !== day || !draft) return
    if (draft.endMinutes - draft.startMinutes < SLOT_MIN_MINUTES) {
      setDraft(null)
      setDragDay(null)
      setDragStart(null)
      return
    }
    // Open modal to create
    setEditing(null)
    setNewRange(draft)
    setFormType("messe")
    setFormDay(draft.day)
    setFormStartTime(minutesToTime(draft.startMinutes))
    setFormEndTime(minutesToTime(draft.endMinutes))
    setFormCapacity("")
    setFormNotes("")
    setFormAvailable(true)
    setModalOpen(true)
    setDraft(null)
    setDragDay(null)
    setDragStart(null)
  }

  // Cancel drag on mouseleave grid
  useEffect(() => {
    const cancel = () => {
      setDraft(null)
      setDragDay(null)
      setDragStart(null)
    }
    window.addEventListener("mouseup", cancel)
    return () => window.removeEventListener("mouseup", cancel)
  }, [])

  /* ---------- Click existing slot to edit ---------- */
  const openEdit = (slot: ITimeSlot) => {
    setEditing(slot)
    setNewRange(null)
    setFormType((slot.type as ITimeSlotType) ?? "autre")
    setFormDay(slot.weekday)
    setFormStartTime(minutesToTime(parseTimeToMinutes(slot.start_time)))
    setFormEndTime(minutesToTime(parseTimeToMinutes(slot.end_time)))
    setFormCapacity(slot.capacity ? String(slot.capacity) : "")
    setFormNotes(slot.notes ?? "")
    setFormAvailable(slot.is_available)
    setModalOpen(true)
  }

  /* ---------- Save ---------- */
  const save = async () => {
    const startM = parseTimeToMinutes(formStartTime)
    const endM = parseTimeToMinutes(formEndTime)
    if (endM <= startM) {
      toast.error("L'heure de fin doit être après l'heure de début.")
      return
    }
    setSaving(true)
    try {
      const payload = {
        type: formType,
        weekday: formDay,
        start_time: formStartTime,
        end_time: formEndTime,
        capacity: formCapacity ? Number(formCapacity) : null,
        notes: formNotes || null,
        is_available: formAvailable,
      }
      if (editing) {
        const res = await timeSlotAPI.modifier(editing.id, payload)
        setSlots((prev) => prev.map((s) => (s.id === editing.id ? res.data : s)))
        toast.success("Plage mise à jour")
      } else {
        const res = await timeSlotAPI.ajouter(payload)
        setSlots((prev) => [...prev, res.data])
        toast.success("Plage créée")
      }
      setModalOpen(false)
      setEditing(null)
      setNewRange(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur")
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    if (!deleteId) return
    try {
      await timeSlotAPI.supprimer(deleteId)
      setSlots((prev) => prev.filter((s) => s.id !== deleteId))
      toast.success("Plage supprimée")
      setDeleteId(null)
      setModalOpen(false)
    } catch {
      toast.error("Erreur")
    }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = {}
    for (const s of slots) c[s.type] = (c[s.type] ?? 0) + 1
    return c
  }, [slots])

  /* ---------- Render ---------- */
  const totalHours = HOUR_END - HOUR_START
  const gridHeight = totalHours * HOUR_HEIGHT

  return (
    <div>
      <Header title="Horaires & Créneaux" />

      <p className="text-sm text-gray-500 mb-6 max-w-3xl">
        Cliquez-glissez sur le calendrier pour créer une plage. Cliquez sur une plage existante pour la modifier.
        Les fidèles ne pourront sélectionner que ces créneaux lors de leurs demandes.
      </p>

      {/* Légende + toggle visibilité */}
      <div className="flex flex-wrap gap-2 mb-6 items-center">
        <span className="text-xs text-gray-500 font-medium mr-1">Afficher :</span>
        {TIME_SLOT_TYPES.map((t) => {
          const colors = TYPE_COLORS[t.value]
          const visible = visibleTypes[t.value]
          const count = counts[t.value] ?? 0
          return (
            <button
              key={t.value}
              onClick={() => setVisibleTypes((p) => ({ ...p, [t.value]: !p[t.value] }))}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                visible ? `${colors.bg} ${colors.text} ${colors.border}` : "bg-gray-50 text-gray-400 border-gray-200"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${colors.solid}`} />
              {t.label} ({count})
              {!visible && <X className="w-3 h-3" />}
            </button>
          )
        })}
      </div>

      {loading && <p className="text-center text-gray-400 py-12">Chargement du calendrier...</p>}

      {!loading && (
        <Card className="overflow-hidden">
          <Card.Content className="p-0">
            {/* Entête jours */}
            <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-gray-100">
              <div className="py-2 text-xs text-gray-400 text-center border-r border-gray-100" />
              {WEEKDAYS_FR.map((d) => (
                <div
                  key={d.value}
                  className="py-3 text-center border-r border-gray-100 last:border-r-0"
                >
                  <p className="text-[10px] uppercase text-gray-400 tracking-wider font-semibold">
                    {d.short}
                  </p>
                  <p className="text-sm font-semibold text-[#2d2d83]">{d.long}</p>
                </div>
              ))}
            </div>

            {/* Grille horaires */}
            <div
              ref={gridRef}
              className="grid grid-cols-[60px_repeat(7,1fr)] relative select-none"
              style={{ minHeight: `${gridHeight}px` }}
            >
              {/* Colonne heures */}
              <div className="border-r border-gray-100">
                {hours.map((h) => (
                  <div
                    key={h}
                    className="text-[11px] text-gray-400 text-right pr-2 border-t border-gray-50"
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  >
                    <span className="-translate-y-1/2 inline-block">{String(h).padStart(2, "0")}:00</span>
                  </div>
                ))}
              </div>

              {/* 7 colonnes jours */}
              {WEEKDAYS_FR.map((d) => (
                <div
                  key={d.value}
                  className="relative border-r border-gray-100 last:border-r-0 hover:bg-gray-50/30 cursor-crosshair"
                  style={{ height: `${gridHeight}px` }}
                  onMouseDown={(e) => onColumnMouseDown(d.value, e)}
                  onMouseMove={(e) => onColumnMouseMove(d.value, e)}
                  onMouseUp={() => onColumnMouseUp(d.value)}
                >
                  {/* Lignes horaires */}
                  {hours.map((h, i) => (
                    <div
                      key={h}
                      className="border-t border-gray-50"
                      style={{
                        position: "absolute",
                        top: `${i * HOUR_HEIGHT}px`,
                        left: 0,
                        right: 0,
                        height: `${HOUR_HEIGHT}px`,
                      }}
                    />
                  ))}

                  {/* Draft (preview pendant drag) */}
                  {draft && draft.day === d.value && (
                    <div
                      className="absolute left-1 right-1 rounded-lg bg-[#2d2d83]/30 border-2 border-dashed border-[#2d2d83] pointer-events-none z-10"
                      style={{
                        top: `${((draft.startMinutes - HOUR_START * 60) / 60) * HOUR_HEIGHT}px`,
                        height: `${((draft.endMinutes - draft.startMinutes) / 60) * HOUR_HEIGHT}px`,
                      }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-[#2d2d83]">
                        {minutesToTime(draft.startMinutes)} – {minutesToTime(draft.endMinutes)}
                      </span>
                    </div>
                  )}

                  {/* Slots existants — colonnes calculées pour chevauchement */}
                  {(slotsByDay[d.value] ?? []).map(({ slot, col, cols }) => {
                    const startM = parseTimeToMinutes(slot.start_time)
                    const endM = parseTimeToMinutes(slot.end_time)
                    const colors = TYPE_COLORS[(slot.type as ITimeSlotType) ?? "autre"]
                    const widthPct = 100 / cols
                    const leftPct = col * widthPct
                    return (
                      <button
                        key={slot.id}
                        data-slot-block
                        onClick={(e) => {
                          e.stopPropagation()
                          openEdit(slot)
                        }}
                        className={`absolute rounded-lg border-l-4 text-left px-1.5 py-1 overflow-hidden transition-shadow hover:shadow-md hover:z-30 z-20 ${
                          slot.is_available ? colors.bg : "bg-gray-100 opacity-60"
                        } ${colors.border} ${colors.text}`}
                        style={{
                          top: `${((startM - HOUR_START * 60) / 60) * HOUR_HEIGHT}px`,
                          height: `${Math.max(24, ((endM - startM) / 60) * HOUR_HEIGHT)}px`,
                          left: `calc(${leftPct}% + 2px)`,
                          width: `calc(${widthPct}% - 4px)`,
                        }}
                        title={`${slot.type} ${minutesToTime(startM)}–${minutesToTime(endM)}${slot.notes ? " · " + slot.notes : ""}`}
                      >
                        <p className="text-[10px] font-semibold leading-tight truncate">
                          {minutesToTime(startM)}–{minutesToTime(endM)}
                        </p>
                        <p className="text-[10px] capitalize truncate leading-tight">{slot.type}</p>
                        {slot.capacity && cols === 1 && (
                          <p className="text-[9px] opacity-70 truncate leading-tight">{slot.capacity} places</p>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Modal create/edit */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">
              {editing ? "Modifier la plage" : "Nouvelle plage"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Type — HeroUI Select */}
            <Select
              selectedKey={formType}
              onSelectionChange={(k) => setFormType(String(k) as ITimeSlotType)}
              className="w-full"
            >
              <Label>Type *</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {TIME_SLOT_TYPES.map((t) => (
                    <ListBox.Item key={t.value} id={t.value} textValue={t.label}>
                      {t.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Jour — HeroUI Select */}
            <Select
              selectedKey={String(formDay)}
              onSelectionChange={(k) => setFormDay(Number(k))}
              className="w-full"
            >
              <Label>Jour</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {WEEKDAYS_FR.map((w) => (
                    <ListBox.Item key={w.value} id={String(w.value)} textValue={w.long}>
                      {w.long}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {/* Début / Fin — HeroUI TimeField */}
            <div className="grid grid-cols-2 gap-3">
              <TimeField
                value={(() => {
                  const m = parseTimeToMinutes(formStartTime)
                  return new Time(Math.floor(m / 60), m % 60)
                })()}
                onChange={(v: TimeValue | null) => {
                  if (!v) return
                  setFormStartTime(`${String(v.hour).padStart(2, "0")}:${String(v.minute).padStart(2, "0")}`)
                }}
                hourCycle={24}
              >
                <Label>Début *</Label>
                <TimeField.Group>
                  <TimeField.Input>
                    {(segment) => <TimeField.Segment segment={segment} />}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
              <TimeField
                value={(() => {
                  const m = parseTimeToMinutes(formEndTime)
                  return new Time(Math.floor(m / 60), m % 60)
                })()}
                onChange={(v: TimeValue | null) => {
                  if (!v) return
                  setFormEndTime(`${String(v.hour).padStart(2, "0")}:${String(v.minute).padStart(2, "0")}`)
                }}
                hourCycle={24}
              >
                <Label>Fin *</Label>
                <TimeField.Group>
                  <TimeField.Input>
                    {(segment) => <TimeField.Segment segment={segment} />}
                  </TimeField.Input>
                </TimeField.Group>
              </TimeField>
            </div>

            {/* Capacité — HeroUI NumberField */}
            <NumberField
              value={formCapacity ? Number(formCapacity) : NaN}
              onChange={(v) => setFormCapacity(isNaN(v) ? "" : String(v))}
              minValue={1}
              className="w-full"
            >
              <Label>
                Capacité <span className="text-gray-400 text-xs font-normal">(vide = illimitée)</span>
              </Label>
              <NumberField.Group>
                <NumberField.DecrementButton />
                <NumberField.Input className="w-full" placeholder="Ex : 2 pour écoute individuelle" />
                <NumberField.IncrementButton />
              </NumberField.Group>
            </NumberField>

            {/* Notes — HeroUI TextField + Input */}
            <TextField value={formNotes} onChange={setFormNotes} className="w-full">
              <Label>Notes</Label>
              <Input placeholder="Ex : Messe dominicale animée par la chorale" />
            </TextField>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <Switch
                isSelected={formAvailable}
                onChange={(v) => setFormAvailable(!!v)}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
              <span className="text-sm text-gray-700">
                {formAvailable ? "Plage disponible aux fidèles" : "Plage désactivée (cachée du public)"}
              </span>
            </div>

            <div className="flex gap-2">
              {editing && (
                <Button
                  variant="ghost"
                  className="rounded-xl text-red-600 hover:bg-red-50"
                  onPress={() => setDeleteId(editing.id)}
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </Button>
              )}
              <Button
                variant="primary"
                isDisabled={saving}
                onPress={save}
                className="flex-1 bg-[#98141f] rounded-xl"
              >
                <Check className="w-4 h-4" />
                {saving ? "..." : editing ? "Mettre à jour" : "Créer la plage"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer cette plage ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Les futures demandes ne pourront plus utiliser ce créneau. Action irréversible.
          </p>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setDeleteId(null)}>
              Annuler
            </Button>
            <Button variant="primary" className="bg-red-600" onPress={remove}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
