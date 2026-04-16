"use client"

import { useState, useEffect } from "react"
import { Volume2, Clock, User, GripVertical, Check, X } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { Card, Chip, Separator } from "@heroui/react"
import { ecouteAPI } from "@/features/ecoute/apis/ecoute.api"
import type { IEcoute } from "@/features/ecoute/types/ecoute.type"
import { toast } from "sonner"

const columns = [
  { key: "pending" as const, label: "En attente", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "accepted" as const, label: "Confirmé", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "canceled" as const, label: "Annulé", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
]

function formatDate(iso?: string) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
  } catch { return iso }
}

export default function EcoutesPage() {
  const [data, setData] = useState<IEcoute[]>([])
  const [loading, setLoading] = useState(true)
  const [draggedId, setDraggedId] = useState<number | null>(null)

  useEffect(() => {
    ecouteAPI
      .obtenirTous()
      .then((res) => setData(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement des demandes"))
      .finally(() => setLoading(false))
  }, [])

  const moveToColumn = async (id: number, newStatut: IEcoute["request_status"]) => {
    const prev = data.find((e) => e.id === id)?.request_status
    if (prev === newStatut) return
    setData((d) => d.map((e) => (e.id === id ? { ...e, request_status: newStatut } : e)))
    try {
      await ecouteAPI.modifier(id, { request_status: newStatut })
    } catch {
      setData((d) => d.map((e) => (e.id === id ? { ...e, request_status: prev } : e)))
      toast.error("Erreur lors de la mise à jour")
    }
  }

  const counts = {
    total: data.length,
    pending: data.filter((e) => e.request_status === "pending").length,
    accepted: data.filter((e) => e.request_status === "accepted").length,
  }

  return (
    <div>
      <Header title="Demandes d'Écoute" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Volume2} value={String(counts.total)} label="Total demandes" trend="8%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Clock} value={String(counts.pending).padStart(2, "0")} label="En attente" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatCard icon={Check} value={String(counts.accepted).padStart(2, "0")} label="Confirmées" trend="12%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {columns.map((col) => {
            const items = data.filter((e) => e.request_status === col.key)
            return (
              <div
                key={col.key}
                className={`rounded-xl ${col.bg} border ${col.border} min-h-[300px]`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggedId !== null) {
                    moveToColumn(draggedId, col.key)
                    setDraggedId(null)
                  }
                }}
              >
                <div className="px-4 py-3 flex items-center gap-2">
                  <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                  <span className={`text-xs font-bold ${col.color} bg-white rounded-full w-5 h-5 flex items-center justify-center`}>
                    {items.length}
                  </span>
                </div>

                <div className="px-3 pb-3 space-y-2.5">
                  {items.map((item) => (
                    <Card
                      key={item.id}
                      className="bg-white cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                      draggable
                      onDragStart={() => setDraggedId(item.id ?? null)}
                      onDragEnd={() => setDraggedId(null)}
                    >
                      <Card.Content className="p-3">
                        {item.type && (
                          <div className="mb-2 flex items-start justify-between">
                            <Chip variant="soft" color="default" size="sm">{item.type}</Chip>
                            <GripVertical className="w-4 h-4 text-gray-300" />
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 mb-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-800">{item.fullname}</span>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.message}</p>

                        <Separator className="my-2" />

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(item.created_at)}
                          </span>
                          {item.phone && <span className="truncate max-w-[100px]">{item.phone}</span>}
                        </div>

                        {col.key === "pending" && (
                          <div className="flex gap-1 mt-2">
                            <button
                              onClick={() => item.id && moveToColumn(item.id, "accepted")}
                              className="flex-1 flex items-center justify-center gap-1 text-xs text-green-600 bg-green-50 hover:bg-green-100 rounded-lg py-1 transition-colors"
                            >
                              <Check className="w-3 h-3" /> Confirmer
                            </button>
                            <button
                              onClick={() => item.id && moveToColumn(item.id, "canceled")}
                              className="flex-1 flex items-center justify-center gap-1 text-xs text-red-500 bg-red-50 hover:bg-red-100 rounded-lg py-1 transition-colors"
                            >
                              <X className="w-3 h-3" /> Annuler
                            </button>
                          </div>
                        )}
                      </Card.Content>
                    </Card>
                  ))}

                  {items.length === 0 && (
                    <div className="py-8 text-center text-xs text-gray-400">
                      Glissez une carte ici
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
