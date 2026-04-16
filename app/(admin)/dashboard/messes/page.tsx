"use client"

import { useState, useEffect } from "react"
import { Flame, Check, X, Clock, MapPin, User, CreditCard, ChevronDown, ChevronUp } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Card, Button, Chip, Separator, SearchField } from "@heroui/react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { messeAPI } from "@/features/messe/apis/messe.api"
import type { IMesse } from "@/features/messe/types/messe.type"
import { toast } from "sonner"

const filters = ["all", "pending", "accepted", "canceled"] as const
const filterLabels: Record<string, string> = { all: "Toutes", pending: "En attente", accepted: "Confirmées", canceled: "Annulées" }

function groupByDate(data: IMesse[]) {
  const groups: Record<string, IMesse[]> = {}
  data.forEach((m) => {
    const day = m.date_at ? m.date_at.split("T")[0] : "?"
    if (!groups[day]) groups[day] = []
    groups[day].push(m)
  })
  return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a))
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch {
    return iso
  }
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  } catch {
    return iso
  }
}

export default function MessesPage() {
  const [messes, setMesses] = useState<IMesse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [search, setSearch] = useState("")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: "accept" | "reject" } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    messeAPI
      .obtenirTous()
      .then((res) => setMesses(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement des messes"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = messes
    .filter((m) => filter === "all" || m.request_status === filter)
    .filter(
      (m) =>
        !search ||
        m.fullname.toLowerCase().includes(search.toLowerCase()) ||
        m.type.toLowerCase().includes(search.toLowerCase()),
    )

  const grouped = groupByDate(filtered)

  const counts = {
    total: messes.length,
    pending: messes.filter((m) => m.request_status === "pending").length,
    accepted: messes.filter((m) => m.request_status === "accepted").length,
  }

  const handleConfirmAction = async () => {
    if (!confirmAction) return
    setActionLoading(true)
    try {
      const newStatus = confirmAction.action === "accept" ? "accepted" : "canceled"
      await messeAPI.modifier(String(confirmAction.id), { request_status: newStatus })
      setMesses((prev) =>
        prev.map((m) => (m.id === confirmAction.id ? { ...m, request_status: newStatus } : m)),
      )
      toast.success(confirmAction.action === "accept" ? "Messe confirmée" : "Demande annulée")
    } catch {
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setActionLoading(false)
      setConfirmAction(null)
    }
  }

  return (
    <div>
      <Header title="Demandes de Messes" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Flame} value={String(counts.total)} label="Total ce mois" trend="12%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Clock} value={String(counts.pending).padStart(2, "0")} label="En attente" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatCard icon={Check} value={String(counts.accepted).padStart(2, "0")} label="Confirmées" trend="12%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
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
                  ({messes.filter((m) => m.request_status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <Card className="p-12 text-center">
          <Card.Content>
            <p className="text-gray-400">Chargement...</p>
          </Card.Content>
        </Card>
      )}

      {/* Timeline */}
      {!loading && (
        <div className="space-y-8">
          {grouped.map(([day, dayMesses]) => (
            <div key={day}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#2d2d83] text-white flex items-center justify-center text-sm font-bold">
                  {formatDate(day).split("/")[0]}
                </div>
                <div>
                  <p className="font-semibold text-[#2d2d83] text-sm">{formatDate(day)}</p>
                  <p className="text-xs text-gray-400">{dayMesses.length} demande{dayMesses.length > 1 ? "s" : ""}</p>
                </div>
                <Separator className="flex-1" />
              </div>

              <div className="space-y-3 ml-5 border-l-2 border-[#2d2d83]/10 pl-6">
                {dayMesses.map((m) => {
                  const isExpanded = expandedId === m.id
                  const statusMap: Record<string, "pending" | "confirmed" | "cancelled"> = {
                    pending: "pending",
                    accepted: "confirmed",
                    canceled: "cancelled",
                  }
                  const labelMap: Record<string, string> = {
                    pending: "En attente",
                    accepted: "Confirmé",
                    canceled: "Annulé",
                  }

                  return (
                    <Card key={m.id} className="hover:shadow-md transition-shadow">
                      <Card.Content className="p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5 text-sm text-gray-500 w-16 shrink-0">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{formatTime(m.time_at)}</span>
                          </div>
                          <Chip variant="soft" color="default" size="sm">{m.type}</Chip>
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="text-sm font-medium text-gray-800 truncate">{m.fullname}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge
                              status={m.amount > 0 ? "paid" : "unpaid"}
                              label={m.amount > 0 ? "Payé" : "Non payé"}
                            />
                            <StatusBadge
                              status={statusMap[m.request_status] ?? "pending"}
                              label={labelMap[m.request_status] ?? m.request_status}
                            />
                          </div>
                          <div className="flex items-center gap-1.5">
                            {m.request_status === "pending" && m.id !== undefined && (
                              <>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 rounded-lg"
                                  onPress={() => setConfirmAction({ id: m.id!, action: "accept" })}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-lg"
                                  onPress={() => setConfirmAction({ id: m.id!, action: "reject" })}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-100 rounded-lg"
                              onPress={() => setExpandedId(isExpanded ? null : (m.id ?? null))}
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            {m.email && (
                              <div className="flex items-center gap-2 text-gray-500">
                                <span className="text-xs">✉️</span>
                                <span>{m.email}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-500">
                              <CreditCard className="w-4 h-4" />
                              <span>{m.amount.toLocaleString("fr-FR")} XOF</span>
                            </div>
                            {m.message && (
                              <p className="text-gray-600 sm:col-span-2">{m.message}</p>
                            )}
                          </div>
                        )}
                      </Card.Content>
                    </Card>
                  )
                })}
              </div>
            </div>
          ))}

          {grouped.length === 0 && !loading && (
            <Card className="p-12 text-center">
              <Card.Content>
                <p className="text-gray-400">Aucune demande pour ce filtre.</p>
              </Card.Content>
            </Card>
          )}
        </div>
      )}

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
              ? "La demande sera marquée comme confirmée."
              : "La demande sera annulée."}
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => setConfirmAction(null)}
              disabled={actionLoading}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleConfirmAction}
              disabled={actionLoading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors disabled:opacity-60 ${
                confirmAction?.action === "accept"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {actionLoading ? "..." : confirmAction?.action === "accept" ? "Confirmer" : "Refuser"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
