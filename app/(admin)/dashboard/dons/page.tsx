"use client"

import { useState } from "react"
import { Heart, FileText, Eye } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { BarChart } from "@/components/admin/charts/bar-chart"
import { PieChart } from "@/components/admin/charts/pie-chart"
import { DataTable } from "@/components/admin/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DetailModal } from "@/components/admin/detail-modal"

const barData = [
  { name: "Jan", value: 65 },
  { name: "Fev", value: 85 },
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

const tableData = [
  {
    id: "#D001",
    date: "01/05/2025",
    donateur: "Jean Kouassi",
    montant: "75 000 FCFA",
    projet: "Construction",
    modePaiement: "Mobile Money",
    description: "Don pour la construction de la nouvelle salle paroissiale.",
  },
  {
    id: "#D002",
    date: "02/05/2025",
    donateur: "Marie Konan",
    montant: "50 000 FCFA",
    projet: "Fonctionnement",
    modePaiement: "Espèces",
    description: "Contribution mensuelle au fonctionnement de la paroisse.",
  },
  {
    id: "#D003",
    date: "03/05/2025",
    donateur: "Pierre Yao",
    montant: "100 000 FCFA",
    projet: "Actions caritatives",
    modePaiement: "Virement",
    description: "Don pour les familles démunies de la paroisse.",
  },
  {
    id: "#D004",
    date: "04/05/2025",
    donateur: "Awa Diallo",
    montant: "25 000 FCFA",
    projet: "Construction",
    modePaiement: "Mobile Money",
    description: "Participation au projet de rénovation.",
  },
  {
    id: "#D005",
    date: "05/05/2025",
    donateur: "François Bamba",
    montant: "150 000 FCFA",
    projet: "Autres",
    modePaiement: "Chèque",
    description: "Don pour l'achat d'instruments de musique pour la chorale.",
  },
  {
    id: "#D006",
    date: "06/05/2025",
    donateur: "Claire Touré",
    montant: "30 000 FCFA",
    projet: "Fonctionnement",
    modePaiement: "Espèces",
    description: "Contribution pour les charges de la paroisse.",
  },
]

export default function DonsPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

  const handleRowClick = (row: Record<string, unknown>) => {
    setSelectedItem(row)
    setDetailOpen(true)
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Date" },
    { key: "donateur", label: "Donateur" },
    { key: "montant", label: "Montant" },
    { key: "projet", label: "Projet" },
    { key: "modePaiement", label: "Mode de paiement" },
    {
      key: "actions",
      label: "Action",
      render: (_: unknown, row: Record<string, unknown>) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
            onClick={() => handleRowClick(row)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8 bg-transparent">
            <FileText className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Header title="Gestion des Dons" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard icon={Heart} value="3 685 250 CFA" label="Total des dons (2025)" trend="12%" trendUp />
        <StatCard icon={Heart} value="528 000 CFA" label="Dons du mois" trend="12%" trendUp />
        <StatCard icon={Heart} value="324" label="Nombre de donateurs" trend="12%" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-[#2d2d83]">Évolution des dons</h3>
            <span className="text-xs lg:text-sm text-muted-foreground">Janvier - Juin 2025</span>
          </div>
          <BarChart data={barData} />
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-[#2d2d83]">Répartition des dons par projet</h3>
            <span className="text-xs lg:text-sm text-muted-foreground">2025</span>
          </div>
          <PieChart data={pieData} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-[#2d2d83]">Historique des dons</h2>
        <Button onClick={() => setIsOpen(true)} className="bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px] w-full sm:w-auto">
          + Nouveau projet
        </Button>
      </div>

      <DataTable columns={columns} data={tableData} itemsPerPage={5} />

      {/* Create project dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Nouveau projet</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titre du projet</label>
              <Input placeholder="Nom" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Catégorie</label>
              <Input placeholder="Nom" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Input placeholder="Nom" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Date de publication</label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Image principale (optionnel)</label>
              <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Choisir un fichier
                </Button>
                <span className="text-sm text-muted-foreground">Aucun fichier choisi</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <div className="mt-1 flex items-center gap-2 mb-2">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <span className="font-bold">B</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <span className="italic">I</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <span className="underline">U</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </Button>
              </div>
              <Textarea placeholder="Nom" className="min-h-[120px]" />
            </div>
            <Button className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px]">Créer le projet</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail modal */}
      {selectedItem && (
        <DetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title="Détail du don"
          data={{
            image: "/church-choir-blue-robes.jpg",
            demandeur: selectedItem.donateur as string,
            type: selectedItem.projet as string,
            date: selectedItem.date as string,
            montant: selectedItem.montant as string,
            projet: selectedItem.projet as string,
            modePaiement: selectedItem.modePaiement as string,
            description: selectedItem.description as string,
          }}
        />
      )}
    </div>
  )
}
