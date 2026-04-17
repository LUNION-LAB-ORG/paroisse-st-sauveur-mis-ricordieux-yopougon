"use client"

import { useEffect, useMemo, useState } from "react"
import { Heart, TrendingUp, Users, CreditCard, Plus, Trash2, Gift, Search } from "lucide-react"
import { toast } from "sonner"

import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { BarChart } from "@/components/admin/charts/bar-chart"
import { PieChart } from "@/components/admin/charts/pie-chart"
import { Card, Chip, Button as HeroButton } from "@heroui/react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { donAPI } from "@/features/don/apis/don.api"
import type { IDon, IDonCreer, IDonPaymethod, IDonType } from "@/features/don/types/don.type"

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

export default function DonsPage() {
  const [dons, setDons] = useState<IDon[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [donToDelete, setDonToDelete] = useState<IDon | null>(null)

  // Filters
  const [searchDon, setSearchDon] = useState("")
  const [filterMode, setFilterMode] = useState<string>("all")
  const [filterType, setFilterType] = useState<"all" | IDonType>("all")

  // Form
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

  const wavePercent = useMemo(() => {
    const n = monetaryDons.length
    if (!n) return 0
    return Math.round((monetaryDons.filter((d) => d.paymethod === "wave").length / n) * 100)
  }, [monetaryDons])

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
        // Backend accepte null maintenant ; pour compat on génère une ref si vide en monétaire
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={Heart}
          value={totalAmount >= 1000000 ? `${(totalAmount / 1000000).toFixed(1)}M F` : `${formatAmount(totalAmount)} F`}
          label="Total dons (monétaires)"
          iconBgColor="bg-[#98141f]/10"
          iconColor="text-[#98141f]"
        />
        <StatCard
          icon={TrendingUp}
          value={String(donsThisMonth)}
          label="Ce mois-ci"
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
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

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
          {/* Type filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500 font-medium">Type :</span>
            {([
              { key: "all", label: "Tous" },
              { key: "monetaire", label: "Monétaires" },
              { key: "nature", label: "En nature" },
            ] as const).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterType === f.key ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Mode de paiement filter (pour monétaires) */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-500 font-medium">Mode :</span>
            {[{ key: "all", label: "Tous" }, ...PAYMETHODS.map((p) => ({ key: p.key, label: p.label }))].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilterMode(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  filterMode === f.key ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchDon}
              onChange={(e) => setSearchDon(e.target.value)}
              placeholder="Rechercher un donateur..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <Card>
          <Card.Content className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Donateur</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Montant / Désignation</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Projet</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mode</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDons.map((d) => {
                    const isNature = (d.donation_type ?? "monetaire") === "nature"
                    return (
                      <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3 text-sm text-gray-600">{formatDate(d.donation_at)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{d.donator}</td>
                        <td className="px-4 py-3">
                          <Chip variant="soft" color={isNature ? "warning" : "default"} size="sm">
                            {isNature ? "En nature" : "Monétaire"}
                          </Chip>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isNature ? (
                            <span className="text-gray-600 italic">{d.description || "—"}</span>
                          ) : (
                            <span className="font-bold text-[#2d2d83]">{formatAmount(d.amount)} F</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Chip variant="soft" color="default" size="sm">{d.project}</Chip>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{paymethodLabel(d.paymethod)}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => {
                              setDonToDelete(d)
                              setDeleteOpen(true)
                            }}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            aria-label="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de don</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, donation_type: "monetaire" }))}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    isMonetaryForm ? "bg-[#2d2d83] text-white border-[#2d2d83]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Heart className="w-4 h-4" /> Monétaire
                </button>
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, donation_type: "nature", amount: "0" }))}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                    !isMonetaryForm ? "bg-[#2d2d83] text-white border-[#2d2d83]" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Gift className="w-4 h-4" /> En nature
                </button>
              </div>
            </div>

            {/* Donateur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du donateur *</label>
              <input
                value={form.donator}
                onChange={(e) => setForm((p) => ({ ...p, donator: e.target.value }))}
                placeholder="Jean Dupont (ou Anonyme)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date du don</label>
              <input
                type="date"
                value={form.donation_at}
                onChange={(e) => setForm((p) => ({ ...p, donation_at: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
              />
            </div>

            {/* Affectation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Affectation *</label>
              <select
                value={form.project}
                onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
              >
                {PROJECTS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {isMonetaryForm ? (
              <>
                {/* Montant */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Montant (XOF) *</label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="Ex: 25000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>

                {/* Mode de paiement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mode de paiement *</label>
                  <select
                    value={form.paymethod}
                    onChange={(e) => setForm((p) => ({ ...p, paymethod: e.target.value as IDonPaymethod }))}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20 bg-white"
                  >
                    {PAYMETHODS.map((p) => (
                      <option key={p.key} value={p.key}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Réf transaction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence / Reçu <span className="text-gray-400 text-xs">(optionnel)</span>
                  </label>
                  <input
                    value={form.paytransaction}
                    onChange={(e) => setForm((p) => ({ ...p, paytransaction: e.target.value }))}
                    placeholder="Ex: Reçu n°042, TX123..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    rows={2}
                    placeholder="Ex: don pour la fête patronale..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Désignation du bien (requis pour nature) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Désignation du bien / service *</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    rows={3}
                    placeholder="Ex: 50 kg de riz, 10 bancs en bois, matériel informatique..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>

                {/* Estimation valeur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valeur estimée (XOF) <span className="text-gray-400 text-xs">(optionnel)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={form.amount}
                    onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="Ex: 50000"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/20"
                  />
                </div>
              </>
            )}

            <button
              onClick={handleAddDon}
              disabled={submitting}
              className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-xl py-3 font-medium transition-colors disabled:opacity-60"
            >
              {submitting ? "Enregistrement..." : "Enregistrer le don"}
            </button>
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
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
            >
              Supprimer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
