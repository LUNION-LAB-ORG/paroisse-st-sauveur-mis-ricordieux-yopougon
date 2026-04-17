"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Bell,
  Flame,
  Volume2,
  Heart,
  Calendar,
  CalendarPlus,
  CheckCheck,
  Trash2,
  Check,
} from "lucide-react"
import { Card, Button, Chip } from "@heroui/react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { notificationAPI } from "@/features/notification/apis/notification.api"
import type { INotification } from "@/features/notification/types/notification.type"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  flame: Flame,
  volume2: Volume2,
  heart: Heart,
  calendar: Calendar,
  "calendar-plus": CalendarPlus,
  bell: Bell,
}

const BG_MAP: Record<string, string> = {
  messe: "bg-[#2d2d83]/10 text-[#2d2d83]",
  listen: "bg-[#98141f]/10 text-[#98141f]",
  donation: "bg-green-100 text-green-600",
  event_register: "bg-amber-100 text-amber-600",
  organisation: "bg-indigo-100 text-indigo-600",
  system: "bg-gray-100 text-gray-500",
}

const TYPE_LABELS: Record<string, string> = {
  messe: "Messes",
  listen: "Écoutes",
  donation: "Dons",
  event_register: "Événements",
  organisation: "Demandes orga.",
  system: "Système",
}

function relativeTime(iso?: string): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  const diffMs = Date.now() - d.getTime()
  const mins = Math.round(diffMs / 60000)
  if (mins < 1) return "à l'instant"
  if (mins < 60) return `il y a ${mins} min`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 7) return `il y a ${days} j`
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
}

const FILTERS = [
  { key: "all", label: "Toutes" },
  { key: "unread", label: "Non lues" },
  { key: "messe", label: "Messes" },
  { key: "listen", label: "Écoutes" },
  { key: "donation", label: "Dons" },
  { key: "event_register", label: "Événements" },
  { key: "organisation", label: "Demandes orga." },
] as const

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>("all")
  const [marking, setMarking] = useState(false)

  const load = async () => {
    try {
      const res = await notificationAPI.obtenirTous()
      setNotifications(res.data ?? [])
    } catch {
      toast.error("Erreur lors du chargement des notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filter === "all") return true
      if (filter === "unread") return !n.is_read
      return n.type === filter
    })
  }, [notifications, filter])

  const counts = useMemo(() => {
    return {
      total: notifications.length,
      unread: notifications.filter((n) => !n.is_read).length,
      read: notifications.filter((n) => n.is_read).length,
    }
  }, [notifications])

  const markRead = async (id: number) => {
    try {
      await notificationAPI.marquerLue(id)
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
    } catch {
      toast.error("Erreur")
    }
  }

  const markAllRead = async () => {
    setMarking(true)
    try {
      await notificationAPI.marquerToutLu()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      toast.success("Toutes marquées comme lues")
    } catch {
      toast.error("Erreur")
    } finally {
      setMarking(false)
    }
  }

  const remove = async (id: number) => {
    try {
      await notificationAPI.supprimer(id)
      setNotifications((prev) => prev.filter((n) => n.id !== id))
      toast.success("Supprimée")
    } catch {
      toast.error("Erreur")
    }
  }

  return (
    <div>
      <Header title="Notifications" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Bell}
          value={String(counts.total)}
          label="Total"
          iconBgColor="bg-[#2d2d83]/10"
          iconColor="text-[#2d2d83]"
        />
        <StatCard
          icon={Bell}
          value={String(counts.unread)}
          label="Non lues"
          iconBgColor="bg-[#98141f]/10"
          iconColor="text-[#98141f]"
        />
        <StatCard
          icon={Check}
          value={String(counts.read)}
          label="Lues"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
      </div>

      {/* Filtres + Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex gap-2 flex-wrap flex-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.key ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
              {f.key === "unread" && counts.unread > 0 && (
                <span className="ml-1.5 bg-white/30 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                  {counts.unread}
                </span>
              )}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          isDisabled={marking || counts.unread === 0}
          onPress={markAllRead}
          className="rounded-xl"
        >
          <CheckCheck className="w-4 h-4" /> Tout marquer comme lu
        </Button>
      </div>

      {/* Liste */}
      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

      {!loading && filtered.length === 0 && (
        <Card className="p-12">
          <Card.Content className="text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune notification pour ce filtre.</p>
          </Card.Content>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((n) => {
            const Icon = ICON_MAP[n.icon ?? "bell"] ?? Bell
            const bgCls = BG_MAP[n.type] ?? "bg-gray-100 text-gray-500"
            return (
              <Card
                key={n.id}
                className={`hover:shadow-sm transition-shadow ${!n.is_read ? "border-l-4 border-l-[#98141f]" : ""}`}
              >
                <Card.Content className="p-4 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bgCls}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${!n.is_read ? "text-[#2d2d83]" : "text-gray-700"}`}>
                        {n.title}
                      </h3>
                      {!n.is_read && (
                        <span className="w-2 h-2 rounded-full bg-[#98141f]" aria-label="Non lue" />
                      )}
                      <Chip variant="soft" color="default" size="sm">
                        {TYPE_LABELS[n.type] ?? n.type}
                      </Chip>
                    </div>
                    {n.message && <p className="text-sm text-gray-600 mb-2">{n.message}</p>}
                    <p className="text-xs text-gray-400">{relativeTime(n.created_at)}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => !n.is_read && markRead(n.id)}
                        className="inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-medium text-[#2d2d83] bg-[#2d2d83]/5 hover:bg-[#2d2d83]/10 transition-colors"
                      >
                        Voir
                      </Link>
                    )}
                    {!n.is_read && (
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-lg text-green-600 hover:bg-green-50"
                        onPress={() => markRead(n.id)}
                        aria-label="Marquer comme lu"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 rounded-lg text-red-500 hover:bg-red-50"
                      onPress={() => remove(n.id)}
                      aria-label="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
