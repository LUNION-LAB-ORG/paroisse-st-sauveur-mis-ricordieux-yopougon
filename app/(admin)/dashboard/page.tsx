"use client"

import { BarChart } from "@/components/admin/charts/bar-chart"
import { PieChart } from "@/components/admin/charts/pie-chart"
import { DataTable } from "@/components/admin/data-table"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Calendar, Check, Flame, Heart, Volume2, X } from "lucide-react"

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

const tableData = [
  {
    id: "#M001",
    date: "02/05/2025 - 10:30",
    demandeur: "Jean Konan",
    type: "Pour un défunt",
    paiement: "paid",
    statut: "pending",
    statutLabel: "En attente",
  },
  {
    id: "#M002",
    date: "03/05/2025 - 14:00",
    demandeur: "Marie Kouadio",
    type: "Action de grâce",
    paiement: "paid",
    statut: "confirmed",
    statutLabel: "Confirmé",
  },
  {
    id: "#M003",
    date: "04/05/2025 - 08:00",
    demandeur: "Paul Aka",
    type: "Pour un malade",
    paiement: "unpaid",
    statut: "pending",
    statutLabel: "En attente",
  },
  {
    id: "#E001",
    date: "05/05/2025 - 16:00",
    demandeur: "Claire Brou",
    type: "Demande d'écoute",
    paiement: "paid",
    statut: "confirmed",
    statutLabel: "Confirmé",
  },
]

const columns = [
  { key: "id", label: "ID" },
  { key: "date", label: "Date demandée" },
  { key: "demandeur", label: "Demandeur" },
  { key: "type", label: "Type" },
  {
    key: "paiement",
    label: "Paiement",
    render: (value: unknown) => (
      <StatusBadge status={value as "paid" | "unpaid"} label={value === "paid" ? "Payé" : "Non payé"} />
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
    render: () => (
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 bg-green-50 border-green-200 text-green-600 hover:bg-green-100 rounded-lg"
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 bg-red-50 border-red-200 text-red-600 hover:bg-red-100 rounded-lg"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
]

export default function DashboardPage() {
  return (
    <div>
      <Header title="Tableau de bord" showSearch />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
        <StatCard
          icon={Flame}
          value="20"
          label="Demandes de messes"
          trend="12%"
          trendUp
          iconBgColor="bg-[#2d2d83]/10"
          iconColor="text-[#2d2d83]"
        />
        <StatCard
          icon={Volume2}
          value="08"
          label="Écoutes en attente"
          trend="12%"
          trendUp={false}
          iconBgColor="bg-[#98141f]/10"
          iconColor="text-[#98141f]"
        />
        <StatCard
          icon={Heart}
          value="50 000 F"
          label="Dons ce mois-ci"
          trend="12%"
          trendUp
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={Calendar}
          value="05"
          label="Événements à venir"
          trend="3%"
          trendUp
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-[#2d2d83]">Évolution des dons</h3>
            <span className="text-xs text-gray-500">Janvier - Juin 2025</span>
          </div>
          <BarChart data={barData} />
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-[#2d2d83]">Répartition des dons</h3>
            <span className="text-xs text-gray-500">2025</span>
          </div>
          <PieChart data={pieData} />
        </div>
      </div>

      {/* Recent requests table */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#2d2d83] mb-4">Demandes récentes</h2>
      </div>
      <DataTable columns={columns} data={tableData} actionButton={{ label: "Exporter", onClick: () => {} }} />
    </div>
  )
}
