"use client"

import { useState } from "react"
import { Heart, TrendingUp, Users, CreditCard, Plus, Search, Eye } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { BarChart } from "@/components/admin/charts/bar-chart"
import { PieChart } from "@/components/admin/charts/pie-chart"
import { Card, Chip, Separator, Button, SearchField, Input, Label, Select, ListBox, TextField, TextArea } from "@heroui/react"
import { StatusBadge } from "@/components/admin/status-badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

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

const recentDons = [
  { id: "D001", donateur: "Jean Kouassi", montant: "75 000", projet: "Construction", date: "01/05", mode: "Mobile Money" },
  { id: "D002", donateur: "Marie Konan", montant: "50 000", projet: "Fonctionnement", date: "02/05", mode: "Espèces" },
  { id: "D003", donateur: "Pierre Yao", montant: "100 000", projet: "Caritatives", date: "03/05", mode: "Virement" },
  { id: "D004", donateur: "Awa Diallo", montant: "25 000", projet: "Construction", date: "04/05", mode: "Mobile Money" },
  { id: "D005", donateur: "François Bamba", montant: "45 000", projet: "Fonctionnement", date: "05/05", mode: "Espèces" },
]

const projets = [
  { nom: "Construction salle paroissiale", objectif: 5000000, collecte: 3685250, couleur: "#2d2d83" },
  { nom: "Rénovation chapelle", objectif: 2000000, collecte: 640000, couleur: "#98141f" },
  { nom: "Aide aux démunis", objectif: 1000000, collecte: 780000, couleur: "#c49a2a" },
]

const historique = [
  { id: "D001", date: "01/05/2025", donateur: "Jean Kouassi", montant: "75 000", projet: "Construction", mode: "Mobile Money", type: "numerique" },
  { id: "D002", date: "02/05/2025", donateur: "Marie Konan", montant: "50 000", projet: "Fonctionnement", mode: "Espèces", type: "manuel" },
  { id: "D003", date: "03/05/2025", donateur: "Pierre Yao", montant: "100 000", projet: "Caritatives", mode: "Virement", type: "numerique" },
  { id: "D004", date: "04/05/2025", donateur: "Awa Diallo", montant: "25 000", projet: "Construction", mode: "Mobile Money", type: "numerique" },
  { id: "D005", date: "05/05/2025", donateur: "François Bamba", montant: "45 000", projet: "Fonctionnement", mode: "Espèces", type: "manuel" },
  { id: "D006", date: "06/05/2025", donateur: "Claire Touré", montant: "30 000", projet: "Fonctionnement", mode: "Nature (riz 50kg)", type: "nature" },
  { id: "D007", date: "06/05/2025", donateur: "Anonyme", montant: "15 000", projet: "Caritatives", mode: "Quête dimanche", type: "manuel" },
]

export default function DonsPage() {
  const [addOpen, setAddOpen] = useState(false)
  const [searchDon, setSearchDon] = useState("")
  const [filterMode, setFilterMode] = useState("all")

  const filteredHistorique = historique
    .filter((d) => filterMode === "all" || d.type === filterMode)
    .filter((d) => !searchDon || d.donateur.toLowerCase().includes(searchDon.toLowerCase()))

  return (
    <div>
      <Header title="Gestion des Dons" />

      {/* Hero stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Heart} value="3,7M" label="Total dons 2025" trend="12%" trendUp iconBgColor="bg-[#98141f]/10" iconColor="text-[#98141f]" />
        <StatCard icon={TrendingUp} value="528K" label="Ce mois-ci" trend="8%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Users} value="324" label="Donateurs" trend="5%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={CreditCard} value="62%" label="Mobile Money" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
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

      {/* Bottom row: recent donations + project progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent donations - 2/3 */}
        <Card className="lg:col-span-2">
          <Card.Header className="px-5 pt-5 pb-3">
            <Card.Title className="text-base font-semibold text-[#2d2d83]">Derniers dons</Card.Title>
          </Card.Header>
          <Card.Content className="px-5 pb-5">
            <div className="space-y-0 divide-y divide-gray-50">
              {recentDons.map((don) => (
                <div key={don.id} className="flex items-center gap-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-[#2d2d83]/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-[#2d2d83]">{don.donateur.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{don.donateur}</p>
                    <p className="text-xs text-gray-400">{don.date} · {don.mode}</p>
                  </div>
                  <Chip variant="soft" color="default" size="sm">{don.projet}</Chip>
                  <span className="text-sm font-bold text-[#2d2d83] shrink-0">{don.montant} F</span>
                </div>
              ))}
            </div>
          </Card.Content>
        </Card>

        {/* Project progress - 1/3 */}
        <Card>
          <Card.Header className="px-5 pt-5 pb-3">
            <Card.Title className="text-base font-semibold text-[#2d2d83]">Objectifs projets</Card.Title>
          </Card.Header>
          <Card.Content className="px-5 pb-5 space-y-5">
            {projets.map((p, i) => {
              const pct = Math.round((p.collecte / p.objectif) * 100)
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-gray-700 truncate">{p.nom}</p>
                    <span className="text-xs font-bold" style={{ color: p.couleur }}>{pct}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${pct}%`, backgroundColor: p.couleur }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {(p.collecte / 1000).toFixed(0)}K / {(p.objectif / 1000000).toFixed(1)}M FCFA
                  </p>
                </div>
              )
            })}
          </Card.Content>
        </Card>
      </div>

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
              { key: "numerique", label: "Numériques" },
              { key: "manuel", label: "Espèces" },
              { key: "nature", label: "En nature" },
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredHistorique.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-600">{d.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{d.donateur}</td>
                      <td className="px-4 py-3 text-sm font-bold text-[#2d2d83]">{d.montant} F</td>
                      <td className="px-4 py-3"><Chip variant="soft" color="default" size="sm">{d.projet}</Chip></td>
                      <td className="px-4 py-3 text-sm text-gray-500">{d.mode}</td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={d.type === "numerique" ? "confirmed" : d.type === "nature" ? "pending" : "draft"}
                          label={d.type === "numerique" ? "Numérique" : d.type === "nature" ? "En nature" : "Espèces"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredHistorique.length === 0 && (
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
            Enregistrez un don recu en especes, par cheque ou en nature.
          </p>
          <div className="space-y-4">
            <TextField>
              <Label>Nom du donateur</Label>
              <Input placeholder="Jean Dupont (ou Anonyme)" />
            </TextField>

            <TextField>
              <Label>Montant (FCFA)</Label>
              <Input type="number" placeholder="Ex: 25 000" />
            </TextField>

            <Select placeholder="Choisir un projet">
              <Label>Affectation</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="fonctionnement" textValue="Fonctionnement">Fonctionnement</ListBox.Item>
                  <ListBox.Item id="construction" textValue="Construction">Construction</ListBox.Item>
                  <ListBox.Item id="caritatives" textValue="Actions caritatives">Actions caritatives</ListBox.Item>
                  <ListBox.Item id="autre" textValue="Autre">Autre</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <Select placeholder="Choisir le mode">
              <Label>Mode de paiement</Label>
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  <ListBox.Item id="especes" textValue="Espèces">Especes</ListBox.Item>
                  <ListBox.Item id="cheque" textValue="Chèque">Cheque</ListBox.Item>
                  <ListBox.Item id="quete" textValue="Quête">Quete</ListBox.Item>
                  <ListBox.Item id="nature" textValue="Don en nature">Don en nature</ListBox.Item>
                </ListBox>
              </Select.Popover>
            </Select>

            <TextField>
              <Label>Notes (optionnel)</Label>
              <TextArea placeholder="Ex: Sac de riz 50kg, don pour la fete patronale..." rows={2} />
            </TextField>

            <button className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-xl py-3 font-medium transition-colors">
              Enregistrer le don
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
