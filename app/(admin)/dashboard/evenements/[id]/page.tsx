"use client"

import { Calendar } from "lucide-react"
import Link from "next/link"
import { StatCard } from "@/components/admin/stat-card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

const tableData = [
  {
    nom: "Bernard Julie",
    email: "julie.bernard@example.com",
    dateInscription: "11/05/2025",
    montant: "2000 FCFA",
    statut: "paid",
    statutLabel: "Payé",
  },
  {
    nom: "Bernard Julie",
    email: "julie.bernard@example.com",
    dateInscription: "11/05/2025",
    montant: "18:00 - 20:00",
    statut: "unpaid",
    statutLabel: "Non payé",
  },
  {
    nom: "Bernard Julie",
    email: "julie.bernard@example.com",
    dateInscription: "11/05/2025",
    montant: "2000 FCFA",
    statut: "paid",
    statutLabel: "Payé",
  },
  {
    nom: "Bernard Julie",
    email: "julie.bernard@example.com",
    dateInscription: "11/05/2025",
    montant: "18:00 - 20:00",
    statut: "unpaid",
    statutLabel: "Non payé",
  },
]

const columns = [
  { key: "nom", label: "Nom" },
  { key: "email", label: "Email" },
  { key: "dateInscription", label: "Date d'inscription" },
  { key: "montant", label: "Montant" },
  {
    key: "statut",
    label: "Statut paiement",
    render: (_: unknown, row: Record<string, unknown>) => (
      <StatusBadge status={row.statut as "paid" | "unpaid"} label={row.statutLabel as string} />
    ),
  },
  {
    key: "actions",
    label: "Actions",
    render: (_: unknown, row: Record<string, unknown>) =>
      row.statut === "unpaid" ? (
        <Button variant="outline" size="sm" className="text-accent border-accent bg-transparent">
          Envoyer rappel
        </Button>
      ) : null,
  },
]

export default function EventDetailPage() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-[#2d2d83]">Gestion des inscrit #M001</h1>
        <Link href="/dashboard/evenements" className="text-accent hover:underline">
          Retour
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard icon={Calendar} value="20" label="Inscrit sur 30" trend="12%" trendUp />
        <StatCard icon={Calendar} value="15" label="Payé" trend="12%" trendUp />
        <StatCard icon={Calendar} value="5" label="Non payé" trend="12%" trendUp />
      </div>

      <h2 className="text-lg lg:text-xl font-bold text-[#2d2d83] mb-4">Liste des inscrits</h2>

      <DataTable columns={columns} data={tableData} actionButton={{ label: "Télécharger", onClick: () => {} }} />
    </div>
  )
}
