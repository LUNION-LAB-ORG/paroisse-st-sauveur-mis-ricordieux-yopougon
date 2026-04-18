"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart, TrendingUp, Users, Plus, Trash2, Gift } from "lucide-react"
import { toast } from "sonner"

import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { BarChart } from "@/components/admin/charts/bar-chart"
import { PieChart } from "@/components/admin/charts/pie-chart"
import {
  Card,
  Chip,
  Button as HeroButton,
  TextField,
  TextArea,
  Input,
  Label,
  NumberField,
  Select,
  ListBox,
  SearchField,
  DatePicker,
  DateField,
  Calendar as HeroCalendar,
  Table,
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

import { donAPI } from "@/features/don/apis/don.api"
import type { IDon, IDonCreer, IDonPaymethod, IDonType } from "@/features/don/types/don.type"
import { trendFromItemsByDate, trendFromItemsByDateSum } from "@/lib/trend"

const MONTHS_FR = ["Jan", "Fév", "Mars", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"] as const
const PIE_PALETTE = ["#2d2d83", "#98141f", "#c49a2a", "#6b7280", "#10b981", "#f59e0b", "#3b82f6"]

const PROJECTS = [
  "Fonctionnement",
  "Construction",
  "Actions caritatives",
  "Chorale - instruments",
  "Réfection toiture",
  "Caisse paroisse",
  "Autre",
] as const

const PAYMETHODS: { key: IDonPaymethod; label: string }[] = [
  { key: "especes", label: "Espèces" },
  { key: "cheque", label: "Chèque" },
  { key: "virement", label: "Virement" },
  { key: "wave", label: "Wave" },
  { key: "orange_money", label: "Orange Money" },
  { key: "mtn", label: "MTN Money" },
  { key: "autre", label: "Autre" },
]

const EMPTY_FORM: {
  donator: string
  donation_type: IDonType
  amount: string
  project: string
  paymethod: IDonPaymethod
  paytransaction: string
  description: string
  donation_at: string
} = {
  donator: "",
  donation_type: "monetaire",
  amount: "",
  project: "Fonctionnement",
  paymethod: "especes",
  paytransaction: "",
  description: "",
  donation_at: new Date().toISOString().slice(0, 10),
}

function formatDate(iso?: string) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

function formatAmount(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n))
}

function paymethodLabel(k?: string | null) {
  if (!k) return "—"
  return PAYMETHODS.find((p) => p.key === k)?.label ?? k
}

function toDateValue(iso: string): DateValue | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  return m ? new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3])) : null
}
function toIso(d: DateValue | null): string {
  if (!d) return ""
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`
}

export default function DonsPage() {
  const [dons, setDons] = useState<IDon[]>([])
  const [loading, setLoading] = useState(true)

  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [donToDelete, setDonToDelete] = useState<IDon | null>(null)

  const [searchDon, setSearchDon] = useState("")
  const [filterMode, setFilterMode] = useState<string>("all")
  const [filterType, setFilterType] = useState<"all" | IDonType>("all")

  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    donAPI
      .obtenirTous()
      .then((res) => setDons((res.data as IDon[]) ?? []))
      .catch(() => toast.error("Erreur lors du chargement des dons"))
      .finally(() => setLoading(false))
  }, [])

  /* ============ DERIVED ============ */

  const filteredDons = useMemo(() => {
    return dons
      .filter((d) => filterType === "all" || (d.donation_type ?? "monetaire") === filterType)
      .filter((d) => filterMode === "all" || d.paymethod === filterMode)
      .filter((d) => !searchDon || d.donator.toLowerCase().includes(searchDon.toLowerCase()))
  }, [dons, filterType, filterMode, searchDon])

  const monetaryDons = useMemo(
    () => dons.filter((d) => (d.donation_type ?? "monetaire") === "monetaire"),
    [dons],
  )
  const natureDons = useMemo(
    () => dons.filter((d) => d.donation_type === "nature"),
    [dons],
  )

  const totalAmount = useMemo(
    () => monetaryDons.reduce((sum, d) => sum + Number(d.amount || 0), 0),
    [monetaryDons],
  )

  const donsThisMonth = useMemo(() => {
    const now = new Date()
    return dons.filter((d) => {
      if (!d.donation_at) return false
      const dd = new Date(d.donation_at)
      return dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear()
    }).length
  }, [dons])

  const barData = useMemo(() => {
    const now = new Date()
    const points: { name: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = MONTHS_FR[d.getMonth()]
      const total = monetaryDons
        .filter((x) => {
          if (!x.donation_at) return false
          const dd = new Date(x.donation_at)
          return dd.getMonth() === d.getMonth() && dd.getFullYear() === d.getFullYear()
        })
        .reduce((s, x) => s + Number(x.amount || 0), 0)
      points.push({ name: label, value: total })
    }
    return points
  }, [monetaryDons])

  const barLabel = useMemo(() => {
    const now = new Date()
    const first = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    return `${MONTHS_FR[first.getMonth()]} ${first.getFullYear()} - ${MONTHS_FR[now.getMonth()]} ${now.getFullYear()}`
  }, [])

  const pieData = useMemo(() => {
    const totals = new Map<string, number>()
    for (const d of monetaryDons) {
      const key = d.project || "Autres"
      totals.set(key, (totals.get(key) ?? 0) + Number(d.amount || 0))
    }
    const values = Array.from(totals.values())
    const sum = values.reduce((s, v) => s + v, 0) || 1
    return Array.from(totals.entries()).map(([name, value], i) => ({
      name: `${name} (${Math.round((value / sum) * 100)}%)`,
      value,
      color: PIE_PALETTE[i % PIE_PALETTE.length],
    }))
  }, [monetaryDons])

  /* ============ HANDLERS ============ */

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setAddOpen(true)
  }

  const handleAddDon = async () => {
    if (!form.donator.trim()) {
      toast.error("Le nom du donateur est requis.")
      return
    }
    if (!form.project.trim()) {
      toast.error("L'affectation est requise.")
      return
    }

    const isMonetary = form.donation_type === "monetaire"
    const amount = Number(form.amount || 0)
    if (isMonetary && (!form.amount || isNaN(amount) || amount <= 0)) {
      toast.error("Montant invalide pour un don monétaire.")
      return
    }
    if (!isMonetary && !form.description.trim()) {
      toast.error("Merci de décrire le don en nature (désignation du bien).")
      return
    }

    setSubmitting(true)
    try {
      const payload: IDonCreer = {
        donator: form.donator.trim() || "Anonyme",
        donation_type: form.donation_type,
        amount: isMonetary ? amount : Number(form.amount || 0),
        project: form.project,
        paymethod: isMonetary ? form.paymethod : null,
        paytransaction: isMonetary
          ? (form.paytransaction.trim() || `MANUAL-${Date.now()}`)
          : null,
        description: form.description.trim() || null,
        donation_at: form.donation_at,
      }
      const res = await donAPI.ajouter(payload)
      const newDon = (res as unknown as { data?: IDon }).data ?? (res as unknown as IDon)
      setDons((prev) => [newDon, ...prev])
      toast.success("Don enregistré")
      setAddOpen(false)
      setForm(EMPTY_FORM)
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur lors de l'enregistrement"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!donToDelete) return
    try {
      await donAPI.supprimer(donToDelete.id)
      toast.success("Don supprimé")
      setDons((prev) => prev.filter((x) => x.id !== donToDelete.id))
      setDeleteOpen(false)
      setDonToDelete(null)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erreur")
    }
  }

  const isMonetaryForm = form.donation_type === "monetaire"

  return (
    <div>
      <Header title="Gestion des Dons" />

      {/* Stats avec trends réels */}
      {(() => {
        const monetaryItems = monetaryDons as unknown as Record<string, unknown>[]
        const allItems = dons as unknown as Record<string, unknown>[]
        const natureItems = natureDons as unknown as Record<string, unknown>[]
        const totalTrend = trendFromItemsByDateSum(monetaryItems, "donation_at", "amount")
        const thisMonthTrend = trendFromItemsByDate(allItems, "donation_at")
        const natureTrend = trendFromItemsByDate(natureItems, "donation_at")
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={Heart}
              value={totalAmount >= 1000000 ? `${(totalAmount / 1000000).toFixed(1)}M F` : `${formatAmount(totalAmount)} F`}
              label="Total dons (monétaires)"
              trend={totalTrend.trend ?? undefined}
              trendUp={totalTrend.trendUp}
              iconBgColor="bg-[#98141f]/10"
              iconColor="text-[#98141f]"
            />
            <StatCard
              icon={TrendingUp}
              value={String(donsThisMonth)}
              label="Ce mois-ci"
              trend={thisMonthTrend.trend ?? undefined}
              trendUp={thisMonthTrend.trendUp}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              icon={Users}
              value={String(new Set(dons.map((d) => d.donator)).size)}
              label="Donateurs"
              iconBgColor="bg-[#2d2d83]/10"
              iconColor="text-[#2d2d83]"
            />
            <StatCard
              icon={Gift}
              value={String(natureDons.length)}
              label="Dons en nature"
              trend={natureTrend.trend ?? undefined}
              trendUp={natureTrend.trendUp}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-600"
            />
          </div>
        )
      })()}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <Card.Header className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between w-full">
              <Card.Title className="text-base font-semibold text-[#2d2d83]">Évolution des dons monétaires</Card.Title>
              <span className="text-xs text-gray-400">{barLabel}</span>
            </div>
          </Card.Header>
          <Card.Content className="p-5">
            <BarChart data={barData} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between w-full">
              <Card.Title className="text-base font-semibold text-[#2d2d83]">Répartition par projet</Card.Title>
              <span className="text-xs text-gray-400">{new Date().getFullYear()}</span>
            </div>
          </Card.Header>
          <Card.Content className="p-5">
            {pieData.length > 0 ? (
              <PieChart data={pieData} />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Aucun don monétaire</div>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Historique */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-[#2d2d83]">Historique des dons</h2>
          <HeroButton variant="primary" className="bg-[#98141f] rounded-xl" onPress={openAdd}>
            <Plus className="w-4 h-4" /> Ajouter un don
          </HeroButton>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500 font-medium">Type :</span>
            {([
              { key: "all", label: "Tous" },
              { key: "monetaire", label: "Monétaires" },
              { key: "nature", label: "En nature" },
            ] as const).map((f) => (
              <Chip
                key={f.key}
                variant={filterType === f.key ? "primary" : "soft"}
                size="sm"
                className={filterType === f.key ? "bg-[#2d2d83] text-white cursor-pointer" : "cursor-pointer"}
                onClick={() => setFilterType(f.key)}
              >
                {f.label}
              </Chip>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500 font-medium">Mode :</span>
            {[{ key: "all", label: "Tous" }, ...PAYMETHODS.map((p) => ({ key: p.key, label: p.label }))].map((f) => (
              <Chip
                key={f.key}
                variant={filterMode === f.key ? "primary" : "soft"}
                size="sm"
                className={filterMode === f.key ? "bg-[#2d2d83] text-white cursor-pointer" : "cursor-pointer"}
                onClick={() => setFilterMode(f.key)}
              >
                {f.label}
              </Chip>
            ))}
          </div>

          <div className="max-w-xs">
            <SearchField value={searchDon} onChange={setSearchDon} aria-label="Rechercher">
              <Input placeholder="Rechercher un donateur..." />
            </SearchField>
          </div>
        </div>

        {/* Table */}
        <Card>
          <Card.Content className="p-0">
            <Table aria-label="Liste des dons">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Date</Table.Column>
                    <Table.Column>Donateur</Table.Column>
                    <Table.Column>Type</Table.Column>
                    <Table.Column>Montant / Désignation</Table.Column>
                    <Table.Column>Projet</Table.Column>
                    <Table.Column>Mode</Table.Column>
                    <Table.Column>Statut</Table.Column>
                    <Table.Column>Actions</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {filteredDons.map((d) => {
                      const isNature = (d.donation_type ?? "monetaire") === "nature"
                      return (
                        <Table.Row key={d.id}>
                          <Table.Cell>{formatDate(d.donation_at)}</Table.Cell>
                          <Table.Cell>
                            <span className="font-medium text-gray-800">{d.donator}</span>
                          </Table.Cell>
                          <Table.Cell>
                            <Chip variant="soft" color={isNature ? "warning" : "default"} size="sm">
                              {isNature ? "En nature" : "Monétaire"}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell>
                            {isNature ? (
                              <span className="text-gray-600 italic">{d.description || "—"}</span>
                            ) : (
                              <span className="font-bold text-[#2d2d83]">{formatAmount(d.amount)} F</span>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <Chip variant="soft" color="default" size="sm">{d.project}</Chip>
                          </Table.Cell>
                          <Table.Cell>{paymethodLabel(d.paymethod)}</Table.Cell>
                          <Table.Cell>
                            {d.payment_status === "pending" ? (
                              <Chip variant="soft" color="warning" size="sm">À valider</Chip>
                            ) : d.payment_status === "failed" ? (
                              <Chip variant="soft" color="danger" size="sm">Échoué</Chip>
                            ) : (
                              <Chip variant="soft" color="success" size="sm">Reçu</Chip>
                            )}
                          </Table.Cell>
                          <Table.Cell>
                            <HeroButton
                              variant="ghost"
                              className="rounded-lg text-red-500 hover:bg-red-50"
                              onPress={() => {
                                setDonToDelete(d)
                                setDeleteOpen(true)
                              }}
                              aria-label="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </HeroButton>
                          </Table.Cell>
                        </Table.Row>
                      )
                    })}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
            {filteredDons.length === 0 && !loading && (
              <p className="text-center text-gray-400 text-sm py-8">Aucun don pour ces filtres.</p>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* ============ MODAL AJOUTER DON ============ */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Ajouter un don</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Enregistrez un don reçu — en argent (espèces, chèque, Wave...) ou en nature (biens, services).
          </p>

          <div className="space-y-4">
            {/* Type de don */}
            <div>
              <Label>Type de don</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <HeroButton
                  variant={isMonetaryForm ? "primary" : "outline"}
                  className={`rounded-xl ${isMonetaryForm ? "bg-[#2d2d83]" : ""}`}
                  onPress={() => setForm((p) => ({ ...p, donation_type: "monetaire" }))}
                >
                  <Heart className="w-4 h-4" /> Monétaire
                </HeroButton>
                <HeroButton
                  variant={!isMonetaryForm ? "primary" : "outline"}
                  className={`rounded-xl ${!isMonetaryForm ? "bg-[#2d2d83]" : ""}`}
                  onPress={() => setForm((p) => ({ ...p, donation_type: "nature", amount: "0" }))}
                >
                  <Gift className="w-4 h-4" /> En nature
                </HeroButton>
              </div>
            </div>

            <TextField
              value={form.donator}
              onChange={(v) => setForm((p) => ({ ...p, donator: v }))}
              isRequired
            >
              <Label>Nom du donateur</Label>
              <Input placeholder="Jean Dupont (ou Anonyme)" />
            </TextField>

            <DatePicker
              value={toDateValue(form.donation_at)}
              onChange={(d) => setForm((p) => ({ ...p, donation_at: toIso(d) }))}
            >
              <Label>Date du don</Label>
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

            <Select
              selectedKey={form.project}
              onSelectionChange={(k) => setForm((p) => ({ ...p, project: String(k) }))}
            >
              <Label>Affectation</Label>
              <Select.Trigger>
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {PROJECTS.map((p) => (
                    <ListBox.Item key={p} id={p} textValue={p}>{p}</ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>

            {isMonetaryForm ? (
              <>
                <NumberField
                  fullWidth
                  value={form.amount === "" ? NaN : Number(form.amount)}
                  onChange={(v) => setForm((p) => ({ ...p, amount: isNaN(v) ? "" : String(v) }))}
                  minValue={0}
                  step={100}
                  isRequired
                >
                  <Label>Montant (XOF)</Label>
                  <NumberField.Group>
                    <NumberField.Input placeholder="Ex: 25000" />
                    <NumberField.DecrementButton />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>

                <Select
                  selectedKey={form.paymethod}
                  onSelectionChange={(k) => setForm((p) => ({ ...p, paymethod: String(k) as IDonPaymethod }))}
                >
                  <Label>Mode de paiement</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {PAYMETHODS.map((p) => (
                        <ListBox.Item key={p.key} id={p.key} textValue={p.label}>{p.label}</ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <TextField
                  value={form.paytransaction}
                  onChange={(v) => setForm((p) => ({ ...p, paytransaction: v }))}
                >
                  <Label>Référence / Reçu (optionnel)</Label>
                  <Input placeholder="Ex: Reçu n°042, TX123..." />
                </TextField>

                <TextField
                  value={form.description}
                  onChange={(v) => setForm((p) => ({ ...p, description: v }))}
                >
                  <Label>Notes (optionnel)</Label>
                  <TextArea rows={2} placeholder="Ex: don pour la fête patronale..." />
                </TextField>
              </>
            ) : (
              <>
                <TextField
                  value={form.description}
                  onChange={(v) => setForm((p) => ({ ...p, description: v }))}
                  isRequired
                >
                  <Label>Désignation du bien / service</Label>
                  <TextArea rows={3} placeholder="Ex: 50 kg de riz, 10 bancs en bois, matériel informatique..." />
                </TextField>

                <NumberField
                  fullWidth
                  value={form.amount === "" ? NaN : Number(form.amount)}
                  onChange={(v) => setForm((p) => ({ ...p, amount: isNaN(v) ? "" : String(v) }))}
                  minValue={0}
                  step={100}
                >
                  <Label>Valeur estimée (XOF) (optionnel)</Label>
                  <NumberField.Group>
                    <NumberField.Input placeholder="Ex: 50000" />
                    <NumberField.DecrementButton />
                    <NumberField.IncrementButton />
                  </NumberField.Group>
                </NumberField>
              </>
            )}

            <HeroButton
              variant="primary"
              isDisabled={submitting}
              onPress={handleAddDon}
              className="w-full bg-[#98141f] rounded-xl"
            >
              {submitting ? "Enregistrement..." : "Enregistrer le don"}
            </HeroButton>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============ MODAL DELETE ============ */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer ce don ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            {donToDelete?.donator ?? ""} — {donToDelete?.donation_type === "nature"
              ? donToDelete?.description ?? "Don en nature"
              : `${formatAmount(donToDelete?.amount ?? 0)} F`}
          </p>
          <DialogFooter>
            <HeroButton variant="secondary" onPress={() => setDeleteOpen(false)} className="rounded-xl">
              Annuler
            </HeroButton>
            <HeroButton variant="primary" onPress={confirmDelete} className="bg-red-600 rounded-xl">
              Supprimer
            </HeroButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
