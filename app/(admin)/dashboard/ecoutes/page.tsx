"use client"

import { useState } from "react"
import { Volume2, Check, X, Eye } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { DetailModal } from "@/components/admin/detail-modal"

const tableData = [
  {
    id: "#E001",
    date: "02/05/2025 - 10:30",
    demandeur: "Jean Konan",
    type: "Pour un défunt",
    statut: "pending",
    statutLabel: "En attente",
    rdv: "03/05/2025 14:00",
    lieu: "Paroisse St Sauveur",
    description:
      "Demande d'écoute pour accompagnement spirituel suite au décès d'un proche. Besoin de soutien pastoral.",
  },
  {
    id: "#E002",
    date: "02/05/2025 - 10:30",
    demandeur: "Marie Kouadio",
    type: "Conseil conjugal",
    statut: "confirmed",
    statutLabel: "Rendez-vous fixé",
    rdv: "Non fixé",
    lieu: "Bureau pastoral",
    description: "Séance d'écoute pour un couple en difficulté. Demande de médiation.",
  },
  {
    id: "#E003",
    date: "03/05/2025 - 09:00",
    demandeur: "Pierre Yao",
    type: "Guidance spirituelle",
    statut: "pending",
    statutLabel: "En attente",
    rdv: "04/05/2025 16:00",
    lieu: "Paroisse St Sauveur",
    description: "Demande de direction spirituelle et discernement vocationnel.",
  },
  {
    id: "#E004",
    date: "04/05/2025 - 14:00",
    demandeur: "Awa Diallo",
    type: "Soutien familial",
    statut: "cancelled",
    statutLabel: "Annulée",
    rdv: "05/05/2025 10:00",
    lieu: "Bureau pastoral",
    description: "Écoute pour problèmes familiaux. Annulé par le demandeur.",
  },
  {
    id: "#E005",
    date: "05/05/2025 - 11:00",
    demandeur: "François Bamba",
    type: "Pour un défunt",
    statut: "confirmed",
    statutLabel: "Rendez-vous fixé",
    rdv: "06/05/2025 09:00",
    lieu: "Chapelle Notre Dame",
    description: "Accompagnement dans le deuil suite à la perte d'un parent.",
  },
  {
    id: "#E006",
    date: "06/05/2025 - 15:30",
    demandeur: "Claire Touré",
    type: "Conseil personnel",
    statut: "pending",
    statutLabel: "En attente",
    rdv: "Non fixé",
    lieu: "Paroisse St Sauveur",
    description: "Demande d'écoute pour des difficultés personnelles.",
  },
]

export default function EcoutesPage() {
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Record<string, unknown> | null>(null)

  const handleRowClick = (row: Record<string, unknown>) => {
    setSelectedItem(row)
    setDetailOpen(true)
  }

  const columns = [
    { key: "id", label: "ID" },
    { key: "date", label: "Date de demande" },
    { key: "demandeur", label: "Demandeur" },
    { key: "type", label: "Type d'écoute" },
    {
      key: "statut",
      label: "Statut",
      render: (_: unknown, row: Record<string, unknown>) => (
        <StatusBadge status={row.statut as "pending" | "confirmed" | "cancelled"} label={row.statutLabel as string} />
      ),
    },
    { key: "rdv", label: "Rendez-vous" },
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
      <Header title="Gestion des Demandes d'Écoute" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard icon={Volume2} value="02" label="Demandes en attente" trend="12%" trendUp />
        <StatCard
          icon={Volume2}
          value="19"
          label="Demandes traitées (ce mois)"
          trend="12%"
          trendUp
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard icon={Volume2} value="10" label="Demandes annulée" trend="12%" trendUp />
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
          title="Détails de ecoute"
          data={{
            image: "/church-choir-formation.jpg",
            organisateur: selectedItem.demandeur as string,
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
