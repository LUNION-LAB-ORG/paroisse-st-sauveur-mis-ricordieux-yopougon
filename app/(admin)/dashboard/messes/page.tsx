"use client"

import { useState } from "react"
import { Flame, Check, X, Eye } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { DetailModal } from "@/components/admin/detail-modal"

const tableData = [
  {
    id: "#M001",
    date: "02/05/2025 - 10:30",
    demandeur: "Jean Konan",
    type: "Pour un défunt",
    paiement: "paid",
    statut: "pending",
    statutLabel: "En attente",
    lieu: "Paroisse St Sauveur",
    description:
      "Messe pour le repos de l'âme de notre défunt père. Nous souhaitons une messe solennelle avec la chorale.",
  },
  {
    id: "#M002",
    date: "02/05/2025 - 10:30",
    demandeur: "Marie Kouadio",
    type: "Action de grâce",
    paiement: "paid",
    statut: "confirmed",
    statutLabel: "Confirmé",
    lieu: "Paroisse St Sauveur",
    description: "Messe d'action de grâce pour la réussite aux examens de notre fils.",
  },
  {
    id: "#M003",
    date: "03/05/2025 - 08:00",
    demandeur: "Pierre Yao",
    type: "Pour un malade",
    paiement: "paid",
    statut: "pending",
    statutLabel: "En attente",
    lieu: "Chapelle Notre Dame",
    description: "Messe pour la guérison de notre mère hospitalisée.",
  },
  {
    id: "#M004",
    date: "04/05/2025 - 18:00",
    demandeur: "Awa Diallo",
    type: "Pour un défunt",
    paiement: "unpaid",
    statut: "cancelled",
    statutLabel: "Annulé",
    lieu: "Paroisse St Sauveur",
    description: "Messe de bout de l'an pour notre grand-mère.",
  },
  {
    id: "#M005",
    date: "05/05/2025 - 06:30",
    demandeur: "François Bamba",
    type: "Action de grâce",
    paiement: "paid",
    statut: "confirmed",
    statutLabel: "Confirmé",
    lieu: "Paroisse St Sauveur",
    description: "Messe d'action de grâce pour notre mariage.",
  },
  {
    id: "#M006",
    date: "06/05/2025 - 10:30",
    demandeur: "Claire Touré",
    type: "Pour un malade",
    paiement: "paid",
    statut: "pending",
    statutLabel: "En attente",
    lieu: "Chapelle Notre Dame",
    description: "Intention de messe pour la guérison.",
  },
]

export default function MessesPage() {
  
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

  const handleRowClick = (row: Record<string, unknown>) => {
    setSelectedItem(row)
    setDetailOpen(true)
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Date demandée" },
    { key: "demandeur", label: "Demandeur" },
    { key: "type", label: "Type d'intention" },
    {
      key: "paiement",
      label: "Paiement",
      render: (value: unknown) => (
        <StatusBadge status={value as "paid" | "unpaid"} label={value === "paid" ? "Payé" : "En espèce"} />
      ),
    },
    {
      key: "statut",
      label: "Statut",
      render: (_: unknown, row: Record<string, unknown>) => (
        <StatusBadge status={row.statut as "pending" | "confirmed" | "cancelled"} label={row.statutLabel as string} />
      ),
    },
    {
      key: "actions",
      label: "Actions",
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
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
          >
            <Check className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <Header title="Gestion des Demandes de Messes" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          icon={Flame}
          value="10"
          label="Aujourd'hui"
          trend="12%"
          trendUp
          iconBgColor="bg-[#98141f]/10"
          iconColor="text-[#98141f]"
        />
        <StatCard icon={Flame} value="02" label="En attentes" trend="12%" trendUp />
        <StatCard
          icon={Flame}
          value="19"
          label="Effectué"
          trend="12%"
          trendUp
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        actionButton={{ label: "Exporter", onClick: () => {} }}
        itemsPerPage={5}
      />

      {selectedItem && (
        <DetailModal
          open={detailOpen}
          onOpenChange={setDetailOpen}
          title="Détails de demande"
          data={{
            image: "/church-choir-singing.jpg",
            demandeur: selectedItem.demandeur as string,
            type: selectedItem.type as string,
            date: (selectedItem.date as string).split(" - ")[0],
            heure: (selectedItem.date as string).split(" - ")[1] || "10:30",
            lieu: selectedItem.lieu as string,
            description: selectedItem.description as string,
          }}
        />
      )}
    </div>
  )
}
