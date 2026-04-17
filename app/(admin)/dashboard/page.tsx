"use client"

import { BarChart } from "@/components/admin/charts/bar-chart"
import { PieChart } from "@/components/admin/charts/pie-chart"
import { DataTable } from "@/components/admin/data-table"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { donAPI } from "@/features/don/apis/don.api"
import { ecouteAPI } from "@/features/ecoute/apis/ecoute.api"
import { evenementAPI } from "@/features/evenement/apis/evenement.api"
import { messeAPI } from "@/features/messe/apis/messe.api"
import type { IDon } from "@/features/don/types/don.type"
import type { IEcoute } from "@/features/ecoute/types/ecoute.type"
import type { IEvenement } from "@/features/evenement/types/evenement.type"
import type { IMesse } from "@/features/messe/types/messe.type"
import { Calendar, Check, Flame, Heart, Volume2, X } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { trendFromItemsByDate, trendFromItemsByDateSum } from "@/lib/trend"

const MONTHS_FR = ["Jan", "Fév", "Mars", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"] as const

function formatAmount(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(Math.round(n)) + " F"
}

function formatDateTimeFR(iso?: string | null, time?: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return "—"
  const base = d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  if (time) {
    let hm = time
    // time peut être au format "HH:MM:SS" ou un datetime ISO complet
    if (time.includes("T") || time.includes("-")) {
      const td = new Date(time)
      if (!isNaN(td.getTime())) {
        hm = td.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false })
      }
    } else if (time.length >= 5) {
      hm = time.slice(0, 5)
    }
    return `${base} - ${hm}`
  }
  return base
}

export default function DashboardPage() {
  const [messes, setMesses] = useState<IMesse[]>([])
  const [ecoutes, setEcoutes] = useState<IEcoute[]>([])
  const [dons, setDons] = useState<IDon[]>([])
  const [evenements, setEvenements] = useState<IEvenement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const [mRes, eRes, dRes, evRes] = await Promise.allSettled([
          messeAPI.obtenirTous(),
          ecouteAPI.obtenirTous(),
          donAPI.obtenirTous(),
          evenementAPI.obtenirTous(),
        ])
        if (!mounted) return
        if (mRes.status === "fulfilled") setMesses((mRes.value as { data: IMesse[] }).data ?? [])
        if (eRes.status === "fulfilled") setEcoutes((eRes.value as { data: IEcoute[] }).data ?? [])
        if (dRes.status === "fulfilled") setDons((dRes.value as { data: IDon[] }).data ?? [])
        if (evRes.status === "fulfilled") setEvenements((evRes.value as { data: IEvenement[] }).data ?? [])
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const now = useMemo(() => new Date(), [])

  // Stats
  const messesPendingCount = useMemo(
    () => messes.filter((m) => m.request_status === "pending").length,
    [messes],
  )
  const ecoutesPendingCount = useMemo(
    () => ecoutes.filter((e) => e.request_status === "pending").length,
    [ecoutes],
  )
  const donsMonthTotal = useMemo(
    () =>
      dons
        .filter((d) => {
          if (!d.donation_at) return false
          const dd = new Date(d.donation_at)
          return dd.getMonth() === now.getMonth() && dd.getFullYear() === now.getFullYear()
        })
        .reduce((sum, d) => sum + Number(d.amount || 0), 0),
    [dons, now],
  )
  const evenementsUpcomingCount = useMemo(
    () => evenements.filter((ev) => ev.date_at && new Date(ev.date_at) >= now).length,
    [evenements, now],
  )

  // Bar chart : total dons par mois sur les 6 derniers mois
  const barData = useMemo(() => {
    const points: { name: string; value: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = MONTHS_FR[d.getMonth()]
      const total = dons
        .filter((x) => {
          if (!x.donation_at) return false
          const dd = new Date(x.donation_at)
          return dd.getMonth() === d.getMonth() && dd.getFullYear() === d.getFullYear()
        })
        .reduce((s, x) => s + Number(x.amount || 0), 0)
      points.push({ name: label, value: total })
    }
    return points
  }, [dons, now])

  const barLabel = useMemo(() => {
    if (barData.length === 0) return ""
    const first = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    return `${MONTHS_FR[first.getMonth()]} ${first.getFullYear()} - ${MONTHS_FR[now.getMonth()]} ${now.getFullYear()}`
  }, [barData, now])

  // Pie chart : répartition par project
  const pieData = useMemo(() => {
    const palette = ["#2d2d83", "#98141f", "#c49a2a", "#6b7280", "#10b981", "#f59e0b"]
    const totals = new Map<string, number>()
    for (const d of dons) {
      const key = d.project || "Autres"
      totals.set(key, (totals.get(key) ?? 0) + Number(d.amount || 0))
    }
    const values = Array.from(totals.values())
    const sum = values.reduce((s, v) => s + v, 0) || 1
    return Array.from(totals.entries()).map(([name, value], i) => ({
      name: `${name} (${Math.round((value / sum) * 100)}%)`,
      value,
      color: palette[i % palette.length],
    }))
  }, [dons])

  // Table "Demandes récentes" : fusion messes + écoutes, triée par created_at desc, 10 max
  const tableData = useMemo(() => {
    type Row = {
      id: string
      date: string
      demandeur: string
      type: string
      paiement: "paid" | "unpaid"
      statut: "pending" | "confirmed" | "cancelled"
      statutLabel: string
      _created: number
    }
    const statutMap: Record<string, { statut: "pending" | "confirmed" | "cancelled"; label: string }> = {
      pending: { statut: "pending", label: "En attente" },
      accepted: { statut: "confirmed", label: "Confirmé" },
      canceled: { statut: "cancelled", label: "Annulé" },
    }
    const rows: Row[] = []
    for (const m of messes) {
      const s = statutMap[m.request_status] ?? statutMap.pending
      rows.push({
        id: `#M${String(m.id ?? 0).padStart(3, "0")}`,
        date: formatDateTimeFR(m.date_at, m.time_at),
        demandeur: m.fullname,
        type: m.type || "—",
        paiement: m.payment_status === "succeeded" ? "paid" : "unpaid",
        statut: s.statut,
        statutLabel: s.label,
        _created: m.created_at ? new Date(m.created_at).getTime() : 0,
      })
    }
    for (const e of ecoutes) {
      const s = statutMap[e.request_status ?? "pending"] ?? statutMap.pending
      rows.push({
        id: `#E${String(e.id ?? 0).padStart(3, "0")}`,
        date: formatDateTimeFR(e.created_at ?? null),
        demandeur: e.fullname,
        type: "Demande d'écoute",
        paiement: "unpaid",
        statut: s.statut,
        statutLabel: s.label,
        _created: e.created_at ? new Date(e.created_at).getTime() : 0,
      })
    }
    return rows.sort((a, b) => b._created - a._created).slice(0, 10)
  }, [messes, ecoutes])

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
        <StatusBadge
          status={row.statut as "pending" | "confirmed" | "cancelled"}
          label={row.statutLabel as string}
        />
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

  return (
    <div>
      <Header title="Tableau de bord" showSearch />

      {/* Stat cards — trends réels mois courant vs mois précédent */}
      {(() => {
        const messesTrend = trendFromItemsByDate(messes as unknown as Record<string, unknown>[], "created_at")
        const ecoutesTrend = trendFromItemsByDate(ecoutes as unknown as Record<string, unknown>[], "created_at")
        const donsTrend = trendFromItemsByDateSum(dons as unknown as Record<string, unknown>[], "donation_at", "amount")
        const eventsTrend = trendFromItemsByDate(evenements as unknown as Record<string, unknown>[], "created_at")
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-8">
            <StatCard
              icon={Flame}
              value={loading ? "…" : String(messesPendingCount).padStart(2, "0")}
              label="Demandes de messes"
              trend={messesTrend.trend ?? undefined}
              trendUp={messesTrend.trendUp}
              iconBgColor="bg-[#2d2d83]/10"
              iconColor="text-[#2d2d83]"
            />
            <StatCard
              icon={Volume2}
              value={loading ? "…" : String(ecoutesPendingCount).padStart(2, "0")}
              label="Écoutes en attente"
              trend={ecoutesTrend.trend ?? undefined}
              trendUp={ecoutesTrend.trendUp}
              iconBgColor="bg-[#98141f]/10"
              iconColor="text-[#98141f]"
            />
            <StatCard
              icon={Heart}
              value={loading ? "…" : formatAmount(donsMonthTotal)}
              label="Dons ce mois-ci"
              trend={donsTrend.trend ?? undefined}
              trendUp={donsTrend.trendUp}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              icon={Calendar}
              value={loading ? "…" : String(evenementsUpcomingCount).padStart(2, "0")}
              label="Événements à venir"
              trend={eventsTrend.trend ?? undefined}
              trendUp={eventsTrend.trendUp}
              iconBgColor="bg-amber-100"
              iconColor="text-amber-600"
            />
          </div>
        )
      })()}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-5 mb-8">
        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-[#2d2d83]">Évolution des dons</h3>
            <span className="text-xs text-gray-500">{barLabel}</span>
          </div>
          <BarChart data={barData} />
        </div>

        <div className="bg-white rounded-xl p-5 lg:p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <h3 className="font-semibold text-[#2d2d83]">Répartition des dons</h3>
            <span className="text-xs text-gray-500">{now.getFullYear()}</span>
          </div>
          {pieData.length > 0 ? (
            <PieChart data={pieData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Aucune donnée</div>
          )}
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
