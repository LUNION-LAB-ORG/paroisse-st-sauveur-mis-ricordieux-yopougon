"use client"

import { useState, useEffect } from "react"
import { BookOpen, Plus, Eye, Calendar, User, Edit, Trash2 } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Card, Button, Chip, Separator, SearchField } from "@heroui/react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { mediationAPI } from "@/features/mediation/apis/mediation.api"
import type { IMediation } from "@/features/mediation/types/mediation.type"
import { toast } from "sonner"

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch { return iso }
}

export default function MediationPage() {
  const [meditations, setMeditations] = useState<IMediation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    mediationAPI
      .obtenirTous()
      .then((res) => setMeditations(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement des méditations"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = meditations
    .filter((m) => filter === "all" || m.status === filter)
    .filter((m) => !search || m.title.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await mediationAPI.supprimer(deleteId)
      setMeditations((prev) => prev.filter((m) => m.id !== deleteId))
      toast.success("Méditation supprimée")
      setDeleteId(null)
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <Header title="Méditations" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BookOpen} value={String(meditations.length)} label="Total" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Eye} value={String(meditations.reduce((s, m) => s + (m.views ?? 0), 0))} label="Lectures" trend="15%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={BookOpen} value={String(meditations.filter((m) => m.status === "draft").length)} label="Brouillons" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchField className="flex-1 sm:max-w-xs" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex gap-2 flex-wrap flex-1">
          {[{ key: "all", label: "Toutes" }, { key: "published", label: "Publiées" }, { key: "draft", label: "Brouillons" }].map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === f.key ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f.label}
            </button>
          ))}
        </div>

        <Link href="/dashboard/mediation/new">
          <Button variant="primary" className="bg-[#98141f] rounded-xl"><Plus className="w-4 h-4" /> Nouvelle</Button>
        </Link>
      </div>

      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <Card.Content className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <Chip variant="soft" color="default" size="sm">{m.category}</Chip>
                  <StatusBadge
                    status={m.status === "published" ? "confirmed" : "pending"}
                    label={m.status === "published" ? "Publiée" : "Brouillon"}
                  />
                </div>
                <Card.Title className="text-base font-bold text-[#2d2d83] mb-2 line-clamp-2">{m.title}</Card.Title>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {m.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(m.date_at)}</span>
                  {(m.views ?? 0) > 0 && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {m.views}</span>}
                </div>
                <Separator className="mb-3" />
                <div className="flex gap-2">
                  <Link href={`/dashboard/mediation/${m.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-lg text-sm text-[#2d2d83] border-[#2d2d83]/20"><Edit className="w-3.5 h-3.5" /> Modifier</Button>
                  </Link>
                  <Button variant="ghost" className="rounded-lg text-red-500 hover:bg-red-50" onPress={() => setDeleteId(m.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <Card className="p-12 text-center mt-4">
          <Card.Content>
            <p className="text-gray-400">Aucune méditation pour ce filtre.</p>
          </Card.Content>
        </Card>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">Supprimer ?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteId(null)} disabled={deleting} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Annuler</button>
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
