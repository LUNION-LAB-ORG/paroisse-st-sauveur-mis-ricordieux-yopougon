"use client"

import { useState, useEffect } from "react"
import { Heart, TrendingUp, Users, CreditCard, Plus } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { BarChart } from "@/components/admin/charts/bar-chart"
import { PieChart } from "@/components/admin/charts/pie-chart"
import { Card, Chip, Button, SearchField, Input, Label, Select, ListBox, TextField, TextArea } from "@heroui/react"
import { StatusBadge } from "@/components/admin/status-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { donAPI } from "@/features/don/apis/don.api"
import type { IDon, IDonCreer } from "@/features/don/types/don.type"
import { toast } from "sonner"

const barData = [
  { name: "Jan", value: 65 },
  { name: "Fév", value: 85 },
  { name: "Mars", value: 55 },
  { name: "Avr", value: 45 },
  { name: "Mai", value: 95 },
  { name: "Jun", value: 70 },
]

const pieData = [
  { name: "Fonctionnement (30%)", value: 30, color: "#2d2d83" },
  { name: "Construction (35%)", value: 35, color: "#98141f" },
  { name: "Actions caritatives (20%)", value: 20, color: "#c49a2a" },
  { name: "Autres (15%)", value: 15, color: "#6b7280" },
]

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
  } catch {
    return iso
  }
}

export default function DonsPage() {
  const [dons, setDons] = useState<IDon[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [searchDon, setSearchDon] = useState("")
  const [filterMode, setFilterMode] = useState("all")
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    donator: "",
    amount: "",
    project: "Fonctionnement",
    paymethod: "especes" as IDonCreer["paymethod"],
    description: "",
  })

  useEffect(() => {
    donAPI
      .obtenirTous()
      .then((res) => setDons(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement des dons"))
      .finally(() => setLoading(false))
  }, [])

  const filteredDons = dons
    .filter((d) => filterMode === "all" || d.paymethod === filterMode)
    .filter((d) => !searchDon || d.donator.toLowerCase().includes(searchDon.toLowerCase()))

  const totalAmount = dons.reduce((sum, d) => sum + d.amount, 0)

  const handleAddDon = async () => {
    if (!form.donator || !form.amount) {
      toast.error("Nom et montant requis")
      return
    }
    setSubmitting(true)
    try {
      const payload: IDonCreer = {
        donator: form.donator || "Anonyme",
        amount: Number(form.amount),
        project: form.project,
        paymethod: form.paymethod,
        description: form.description || null,
        donation_at: new Date().toISOString(),
      }
      const res = await donAPI.ajouter(payload)
      setDons((prev) => [res.data, ...prev])
      toast.success("Don enregistré avec succès")
      setAddOpen(false)
      setForm({ donator: "", amount: "", project: "Fonctionnement", paymethod: "especes", description: "" })
    } catch {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Header title="Gestion des Dons" />

      {/* Hero stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Heart} value={totalAmount >= 1000000 ? `${(totalAmount / 1000000).toFixed(1)}M` : `${(totalAmount / 1000).toFixed(0)}K`} label="Total dons" trend="12%" trendUp iconBgColor="bg-[#98141f]/10" iconColor="text-[#98141f]" />
        <StatCard icon={TrendingUp} value={String(dons.filter((d) => { const m = new Date(d.donation_at).getMonth(); return m === new Date().getMonth() }).length)} label="Ce mois-ci" trend="8%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Users} value={String(new Set(dons.map((d) => d.donator)).size)} label="Donateurs" trend="5%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={CreditCard} value={`${dons.length ? Math.round((dons.filter((d) => d.paymethod === "wave").length / dons.length) * 100) : 0}%`} label="Wave" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <Card.Header className="px-5 pt-5 pb-0">
            <div className="flex items-center justify-between w-full">
              <Card.Title className="text-base font-semibold text-[#2d2d83]">Évolution des dons</Card.Title>
              <span className="text-xs text-gray-400">Jan - Jun 2025</span>
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
              <span className="text-xs text-gray-400">2025</span>
            </div>
          </Card.Header>
          <Card.Content className="p-5">
            <PieChart data={pieData} />
          </Card.Content>
        </Card>
      </div>

      {/* Bottom row: recent donations */}
      <Card className="mb-6">
        <Card.Header className="px-5 pt-5 pb-3">
          <Card.Title className="text-base font-semibold text-[#2d2d83]">Derniers dons</Card.Title>
        </Card.Header>
        <Card.Content className="px-5 pb-5">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-4">Chargement...</p>
          ) : (
            <div className="space-y-0 divide-y divide-gray-50">
              {dons.slice(0, 5).map((don) => (
                <div key={don.id} className="flex items-center gap-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-[#2d2d83]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#2d2d83]">{don.donator.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{don.donator}</p>
                    <p className="text-xs text-gray-400">{formatDate(don.donation_at)} · {don.paymethod}</p>
                  </div>
                  <Chip variant="soft" color="default" size="sm">{don.project}</Chip>
                  <span className="text-sm font-bold text-[#2d2d83] shrink-0">{don.amount.toLocaleString("fr-FR")} F</span>
                </div>
              ))}
              {dons.length === 0 && (
                <p className="text-center text-gray-400 text-sm py-4">Aucun don enregistré.</p>
              )}
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Historique des dons */}
      <div className="mt-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-bold text-[#2d2d83]">Historique des dons</h2>
          <Button variant="primary" className="bg-[#98141f] rounded-xl" onPress={() => setAddOpen(true)}>
            <Plus className="w-4 h-4" /> Ajouter un don
          </Button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <SearchField className="flex-1 sm:max-w-xs" value={searchDon} onChange={setSearchDon}>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Rechercher un donateur..." />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all", label: "Tous" },
              { key: "wave", label: "Wave" },
              { key: "especes", label: "Espèces" },
              { key: "cheque", label: "Chèque" },
              { key: "virement", label: "Virement" },
            ].map((f) => (
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Montant</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Projet</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredDons.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(d.donation_at)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{d.donator}</td>
                      <td className="px-4 py-3 text-sm font-bold text-[#2d2d83]">{d.amount.toLocaleString("fr-FR")} F</td>
                      <td className="px-4 py-3"><Chip variant="soft" color="default" size="sm">{d.project}</Chip></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{d.paymethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredDons.length === 0 && !loading && (
              <p className="text-center text-gray-400 text-sm py-8">Aucun don pour ce filtre.</p>
            )}
          </Card.Content>
        </Card>
      </div>

      {/* Modal ajout don manuel */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Ajouter un don</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Enregistrez un don reçu en espèces, par chèque ou en nature.
          </p>
          <div className="space-y-4">
            <TextField value={form.donator} onChange={(v) => setForm((p) => ({ ...p, donator: v }))}>
              <Label>Nom du donateur</Label>
              <Input placeholder="Jean Dupont (ou Anonyme)" />
            </TextField>

            <TextField value={form.amount} onChange={(v) => setForm((p) => ({ ...p, amount: v }))}>
              <Label>Montant (XOF)</Label>
              <Input type="number" placeholder="Ex: 25 000" />
            </TextField>

            <Select
              selectedKey={form.project}
              onSelectionChange={(k) => setForm((p) => ({ ...p, project: String(k) }))}
              placeholder="Choisir un projet"
            >
              <Label>Affectation</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="Fonctionnement" textValue="Fonctionnement">Fonctionnement</ListBox.Item>
                  <ListBox.Item id="Construction" textValue="Construction">Construction</ListBox.Item>
                  <ListBox.Item id="Caritatives" textValue="Actions caritatives">Actions caritatives</ListBox.Item>
                  <ListBox.Item id="Autre" textValue="Autre">Autre</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <Select
              selectedKey={form.paymethod}
              onSelectionChange={(k) => setForm((p) => ({ ...p, paymethod: String(k) as IDonCreer["paymethod"] }))}
              placeholder="Mode de paiement"
            >
              <Label>Mode de paiement</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="especes" textValue="Espèces">Espèces</ListBox.Item>
                  <ListBox.Item id="cheque" textValue="Chèque">Chèque</ListBox.Item>
                  <ListBox.Item id="virement" textValue="Virement">Virement</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <TextField value={form.description} onChange={(v) => setForm((p) => ({ ...p, description: v }))}>
              <Label>Notes (optionnel)</Label>
              <TextArea placeholder="Ex: don pour la fête patronale..." rows={2} />
            </TextField>

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
    </div>
  )
}
