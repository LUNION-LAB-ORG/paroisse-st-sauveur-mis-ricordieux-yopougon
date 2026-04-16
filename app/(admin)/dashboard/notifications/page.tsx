"use client"

import { useState } from "react"
import { Bell, Check, CheckCheck, Flame, Volume2, Heart, Calendar, Trash2, Settings } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { Card, Button, Chip, Separator } from "@heroui/react"

type Notification = {
  id: number
  type: "messe" | "ecoute" | "don" | "evenement" | "systeme"
  titre: string
  message: string
  date: string
  lue: boolean
}

const initialNotifs: Notification[] = [
  { id: 1, type: "messe", titre: "Nouvelle demande de messe", message: "Jean Konan a soumis une demande de messe pour un défunt.", date: "Il y a 5 min", lue: false },
  { id: 2, type: "ecoute", titre: "Demande d'écoute", message: "Marie Kouadio souhaite un rendez-vous pour un conseil conjugal.", date: "Il y a 30 min", lue: false },
  { id: 3, type: "don", titre: "Don reçu", message: "Pierre Yao a fait un don de 100 000 FCFA pour le projet Construction.", date: "Il y a 1h", lue: false },
  { id: 4, type: "evenement", titre: "Nouvel inscrit", message: "Awa Diallo s'est inscrite à l'événement Retraite de Carême.", date: "Il y a 2h", lue: true },
  { id: 5, type: "messe", titre: "Messe confirmée", message: "La messe #M002 de Marie Kouadio a été confirmée.", date: "Il y a 3h", lue: true },
  { id: 6, type: "systeme", titre: "Mise à jour du site", message: "Le site a été mis à jour avec les dernières modifications.", date: "Hier", lue: true },
  { id: 7, type: "don", titre: "Don en nature reçu", message: "François Bamba a fait un don en nature (riz 50kg).", date: "Hier", lue: true },
  { id: 8, type: "ecoute", titre: "Rendez-vous terminé", message: "L'écoute avec Claire Touré a été complétée.", date: "Il y a 2 jours", lue: true },
]

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  messe: { icon: Flame, color: "text-[#98141f]", bg: "bg-[#98141f]/10" },
  ecoute: { icon: Volume2, color: "text-[#2d2d83]", bg: "bg-[#2d2d83]/10" },
  don: { icon: Heart, color: "text-green-600", bg: "bg-green-100" },
  evenement: { icon: Calendar, color: "text-amber-600", bg: "bg-amber-100" },
  systeme: { icon: Settings, color: "text-gray-500", bg: "bg-gray-100" },
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(initialNotifs)
  const [filter, setFilter] = useState("all")

  const unreadCount = notifs.filter((n) => !n.lue).length

  const filtered = filter === "all"
    ? notifs
    : filter === "unread"
      ? notifs.filter((n) => !n.lue)
      : notifs.filter((n) => n.type === filter)

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, lue: true })))
  const markRead = (id: number) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, lue: true } : n))
  const deleteNotif = (id: number) => setNotifs((prev) => prev.filter((n) => n.id !== id))

  return (
    <div>
      <Header title="Notifications" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Bell} value={String(notifs.length)} label="Total" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Bell} value={String(unreadCount)} label="Non lues" iconBgColor="bg-[#98141f]/10" iconColor="text-[#98141f]" />
        <StatCard icon={CheckCheck} value={String(notifs.length - unreadCount)} label="Lues" iconBgColor="bg-green-100" iconColor="text-green-600" />
      </div>

      {/* Filters + mark all read */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "Toutes" },
            { key: "unread", label: `Non lues (${unreadCount})` },
            { key: "messe", label: "Messes" },
            { key: "ecoute", label: "Écoutes" },
            { key: "don", label: "Dons" },
            { key: "evenement", label: "Événements" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.key ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" className="rounded-xl text-sm text-[#2d2d83] border-[#2d2d83]/20" onPress={markAllRead}>
            <CheckCheck className="w-4 h-4" /> Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-2">
        {filtered.map((notif) => {
          const config = typeConfig[notif.type]
          const Icon = config.icon

          return (
            <Card
              key={notif.id}
              className={`transition-all ${!notif.lue ? "border-l-4 border-l-[#98141f] bg-[#98141f]/[0.02]" : ""}`}
            >
              <Card.Content className="px-5 py-4">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.bg}`}>
                    <Icon className={`w-5 h-5 ${config.color}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className={`text-sm font-semibold ${!notif.lue ? "text-gray-900" : "text-gray-600"}`}>
                        {notif.titre}
                      </h3>
                      {!notif.lue && <div className="w-2 h-2 rounded-full bg-[#98141f]" />}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.lue && (
                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:bg-gray-100 rounded-lg" onPress={() => markRead(notif.id)}>
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg" onPress={() => deleteNotif(notif.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <Card.Content>
              <Bell className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400">Aucune notification.</p>
            </Card.Content>
          </Card>
        )}
      </div>
    </div>
  )
}
