"use client"

import { useState } from "react"
import { Volume2, Clock, User, MapPin, GripVertical } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { Card, Chip, Separator } from "@heroui/react"

type Ecoute = {
  id: string
  date: string
  demandeur: string
  type: string
  statut: "pending" | "confirmed" | "done" | "cancelled"
  rdv: string
  lieu: string
  description: string
}

const initialData: Ecoute[] = [
  { id: "E001", date: "02/05/2025", demandeur: "Jean Konan", type: "Accompagnement", statut: "pending", rdv: "Non fixé", lieu: "Paroisse St Sauveur", description: "Accompagnement spirituel suite au décès d'un proche." },
  { id: "E002", date: "02/05/2025", demandeur: "Marie Kouadio", type: "Conseil conjugal", statut: "confirmed", rdv: "05/05 à 14h", lieu: "Bureau pastoral", description: "Séance d'écoute pour un couple en difficulté." },
  { id: "E003", date: "03/05/2025", demandeur: "Pierre Yao", type: "Direction spirituelle", statut: "pending", rdv: "Non fixé", lieu: "Paroisse St Sauveur", description: "Discernement vocationnel." },
  { id: "E004", date: "04/05/2025", demandeur: "Awa Diallo", type: "Soutien familial", statut: "cancelled", rdv: "—", lieu: "Bureau pastoral", description: "Annulé par le demandeur." },
  { id: "E005", date: "05/05/2025", demandeur: "François Bamba", type: "Deuil", statut: "confirmed", rdv: "06/05 à 9h", lieu: "Chapelle Notre Dame", description: "Accompagnement dans le deuil." },
  { id: "E006", date: "06/05/2025", demandeur: "Claire Touré", type: "Conseil personnel", statut: "done", rdv: "Terminé", lieu: "Paroisse St Sauveur", description: "Difficultés personnelles - suivi terminé." },
]

const columns = [
  { key: "pending" as const, label: "En attente", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  { key: "confirmed" as const, label: "RDV fixé", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { key: "done" as const, label: "Terminé", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { key: "cancelled" as const, label: "Annulé", color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" },
]

export default function EcoutesPage() {
  const [data, setData] = useState(initialData)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const moveToColumn = (id: string, newStatut: Ecoute["statut"]) => {
    setData((prev) =>
      prev.map((e) => (e.id === id ? { ...e, statut: newStatut } : e))
    )
  }

  const counts = {
    total: data.length,
    pending: data.filter((e) => e.statut === "pending").length,
    done: data.filter((e) => e.statut === "done").length,
  }

  return (
    <div>
      <Header title="Demandes d'Écoute" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Volume2} value={String(counts.total)} label="Total demandes" trend="8%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Clock} value={String(counts.pending).padStart(2, "0")} label="En attente" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatCard icon={Volume2} value={String(counts.done).padStart(2, "0")} label="Terminées" trend="12%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const items = data.filter((e) => e.statut === col.key)
          return (
            <div
              key={col.key}
              className={`rounded-xl ${col.bg} border ${col.border} min-h-[300px]`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedId) {
                  moveToColumn(draggedId, col.key)
                  setDraggedId(null)
                }
              }}
            >
              {/* Column header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-semibold ${col.color}`}>{col.label}</h3>
                  <span className={`text-xs font-bold ${col.color} bg-white rounded-full w-5 h-5 flex items-center justify-center`}>
                    {items.length}
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="px-3 pb-3 space-y-2.5">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-white cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                    draggable
                    onDragStart={() => setDraggedId(item.id)}
                    onDragEnd={() => setDraggedId(null)}
                  >
                    <Card.Content className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <Chip variant="soft" color="default" size="sm">{item.type}</Chip>
                        <GripVertical className="w-4 h-4 text-gray-300" />
                      </div>

                      <div className="flex items-center gap-1.5 mb-1">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">{item.demandeur}</span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>

                      <Separator className="my-2" />

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{item.rdv}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[80px]">{item.lieu}</span>
                        </div>
                      </div>
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
    </div>
  )
}
