"use client"

import { useState } from "react"
import { Flame, Check, X, Clock, MapPin, User, CreditCard, ChevronDown, ChevronUp, Search } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Card, Button, Chip, Separator, SearchField, Input, Label, TextField, TextArea } from "@heroui/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Messe = {
  id: string
  date: string
  demandeur: string
  type: string
  paiement: "paid" | "unpaid"
  statut: "pending" | "confirmed" | "cancelled"
  statutLabel: string
  lieu: string
  description: string
}

const allData: Messe[] = [
  { id: "#M006", date: "06/05/2025 - 10:30", demandeur: "Claire Touré", type: "Pour un malade", paiement: "paid", statut: "pending", statutLabel: "En attente", lieu: "Chapelle Notre Dame", description: "Intention de messe pour la guérison." },
  { id: "#M005", date: "05/05/2025 - 06:30", demandeur: "François Bamba", type: "Action de grâce", paiement: "paid", statut: "confirmed", statutLabel: "Confirmé", lieu: "Paroisse St Sauveur", description: "Messe d'action de grâce pour notre mariage." },
  { id: "#M004", date: "04/05/2025 - 18:00", demandeur: "Awa Diallo", type: "Pour un défunt", paiement: "unpaid", statut: "cancelled", statutLabel: "Annulé", lieu: "Paroisse St Sauveur", description: "Messe de bout de l'an pour notre grand-mère." },
  { id: "#M003", date: "03/05/2025 - 08:00", demandeur: "Pierre Yao", type: "Pour un malade", paiement: "paid", statut: "pending", statutLabel: "En attente", lieu: "Chapelle Notre Dame", description: "Messe pour la guérison de notre mère hospitalisée." },
  { id: "#M002", date: "02/05/2025 - 10:30", demandeur: "Marie Kouadio", type: "Action de grâce", paiement: "paid", statut: "confirmed", statutLabel: "Confirmé", lieu: "Paroisse St Sauveur", description: "Messe d'action de grâce pour la réussite aux examens." },
  { id: "#M001", date: "02/05/2025 - 10:30", demandeur: "Jean Konan", type: "Pour un défunt", paiement: "paid", statut: "pending", statutLabel: "En attente", lieu: "Paroisse St Sauveur", description: "Messe pour le repos de l'âme de notre défunt père." },
]

const filters = ["all", "pending", "confirmed", "cancelled"] as const
const filterLabels: Record<string, string> = { all: "Toutes", pending: "En attente", confirmed: "Confirmées", cancelled: "Annulées" }

function groupByDate(data: Messe[]) {
  const groups: Record<string, Messe[]> = {}
  data.forEach((m) => {
    const day = m.date.split(" - ")[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(m)
  })
  // Tri decroissant par date
  return Object.entries(groups).sort(([a], [b]) => {
    const [da, ma, ya] = a.split("/").map(Number)
    const [db, mb, yb] = b.split("/").map(Number)
    return (yb * 10000 + mb * 100 + db) - (ya * 10000 + ma * 100 + da)
  })
}

export default function MessesPage() {
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: "accept" | "reject" } | null>(null)

  const filtered = allData
    .filter((m) => filter === "all" || m.statut === filter)
    .filter((m) => !search || m.demandeur.toLowerCase().includes(search.toLowerCase()) || m.type.toLowerCase().includes(search.toLowerCase()))

  const grouped = groupByDate(filtered)

  const counts = {
    total: allData.length,
    pending: allData.filter((m) => m.statut === "pending").length,
    confirmed: allData.filter((m) => m.statut === "confirmed").length,
  }

  const handleConfirmAction = () => {
    if (!confirmAction) return
    // TODO: appel API backend
    console.log(`Action ${confirmAction.action} sur ${confirmAction.id}`)
    setConfirmAction(null)
  }

  return (
    <div>
      <Header title="Demandes de Messes" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Flame} value={String(counts.total)} label="Total ce mois" trend="12%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Clock} value={String(counts.pending).padStart(2, "0")} label="En attente" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatCard icon={Check} value={String(counts.confirmed).padStart(2, "0")} label="Confirmées" trend="12%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      {/* Search + Filter pills */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchField className="flex-1 sm:max-w-xs" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher un demandeur..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filterLabels[f]}
              {f !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({allData.filter((m) => m.statut === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline - decroissant */}
      <div className="space-y-8">
        {grouped.map(([day, messes]) => (
          <div key={day}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#2d2d83] text-white flex items-center justify-center text-sm font-bold">
                {day.split("/")[0]}
              </div>
              <div>
                <p className="font-semibold text-[#2d2d83] text-sm">{day}</p>
                <p className="text-xs text-gray-400">{messes.length} demande{messes.length > 1 ? "s" : ""}</p>
              </div>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-3 ml-5 border-l-2 border-[#2d2d83]/10 pl-6">
              {messes.map((m) => {
                const isExpanded = expandedId === m.id
                const time = m.date.split(" - ")[1] || ""

                return (
                  <Card key={m.id} className="hover:shadow-md transition-shadow">
                    <Card.Content className="p-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 w-16 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{time}</span>
                        </div>
                        <Chip variant="soft" color="default" size="sm">{m.type}</Chip>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="text-sm font-medium text-gray-800 truncate">{m.demandeur}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={m.paiement} label={m.paiement === "paid" ? "Payé" : "Non payé"} />
                          <StatusBadge status={m.statut} label={m.statutLabel} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          {m.statut === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 rounded-lg"
                                onPress={() => setConfirmAction({ id: m.id, action: "accept" })}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                                onPress={() => setConfirmAction({ id: m.id, action: "reject" })}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-100 rounded-lg"
                            onPress={() => setExpandedId(isExpanded ? null : m.id)}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-500">
                            <MapPin className="w-4 h-4" />
                            <span>{m.lieu}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-500">
                            <CreditCard className="w-4 h-4" />
                            <span>2 000 FCFA</span>
                          </div>
                          <p className="text-gray-600 sm:col-span-2">{m.description}</p>
                        </div>
                      )}
                    </Card.Content>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {grouped.length === 0 && (
          <Card className="p-12 text-center">
            <Card.Content>
              <p className="text-gray-400">Aucune demande pour ce filtre.</p>
            </Card.Content>
          </Card>
        )}
      </div>

      {/* Modal confirmation accepter/refuser */}
      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className={confirmAction?.action === "accept" ? "text-green-600" : "text-red-600"}>
              {confirmAction?.action === "accept" ? "Confirmer cette messe ?" : "Refuser cette demande ?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            {confirmAction?.action === "accept"
              ? "La demande sera marquée comme confirmée et le demandeur sera notifié."
              : "La demande sera annulée. Cette action peut être réversible."}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setConfirmAction(null)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmAction}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${
                confirmAction?.action === "accept"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {confirmAction?.action === "accept" ? "Confirmer" : "Refuser"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
