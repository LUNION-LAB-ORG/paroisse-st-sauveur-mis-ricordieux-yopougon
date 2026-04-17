"use client"

import { useState, useEffect } from "react"
import { Newspaper, Plus, Eye, Calendar, User, Edit, Trash2 } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Card, Button, Chip, Separator, SearchField } from "@heroui/react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { actualiteAPI } from "@/features/actualite/apis/actualite.api"
import type { IActualite } from "@/features/actualite/types/actualite.type"
import { toast } from "sonner"

function formatDate(iso: string | null) {
  if (!iso) return "—"
  try {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
  } catch { return iso }
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<IActualite[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    actualiteAPI
      .obtenirTous()
      .then((res) => setArticles(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement des actualités"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = articles
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) => !search || a.title.toLowerCase().includes(search.toLowerCase()))

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await actualiteAPI.supprimer(String(deleteId))
      setArticles((prev) => prev.filter((a) => a.id !== deleteId))
      toast.success("Article supprimé")
      setDeleteId(null)
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <Header title="Actualités" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Newspaper} value={String(articles.length)} label="Total articles" trend="12%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Eye} value={String(articles.reduce((s, a) => s + (a.views ?? 0), 0))} label="Vues totales" trend="8%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Newspaper} value={String(articles.filter((a) => a.status === "draft").length)} label="Brouillons" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchField className="flex-1 sm:max-w-xs" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher un article..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <div className="flex gap-2 flex-wrap flex-1">
          {[
            { key: "all", label: "Tous" },
            { key: "published", label: "Publiés" },
            { key: "draft", label: "Brouillons" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.key ? "bg-[#2d2d83] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Link href="/dashboard/actualites/new">
          <Button variant="primary" className="bg-[#98141f] rounded-xl">
            <Plus className="w-4 h-4" /> Nouvel article
          </Button>
        </Link>
      </div>

      {loading && (
        <p className="text-center text-gray-400 py-12">Chargement...</p>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Image hero */}
              <div className="relative w-full h-40 bg-gray-100">
                {article.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/assets/images/evenement.jpg"
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Newspaper className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <StatusBadge
                    status={article.status === "published" ? "confirmed" : "pending"}
                    label={article.status === "published" ? "Publié" : "Brouillon"}
                  />
                </div>
              </div>

              <Card.Content className="p-4">
                <div className="mb-2">
                  <Chip variant="soft" color="default" size="sm">{article.category}</Chip>
                </div>

                <Card.Title className="text-base font-bold text-[#2d2d83] mb-1 line-clamp-2">
                  {article.title}
                </Card.Title>

                <div className="flex items-center flex-wrap gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(article.published_at ?? article.created_at)}</span>
                  <span className="flex items-center gap-1" title="Vues">
                    <Eye className="w-3 h-3" /> {article.views ?? 0}
                  </span>
                </div>

                <Separator className="mb-3" />

                <div className="flex gap-2">
                  <Link href={`/dashboard/actualites/${article.id}`} className="flex-1">
                    <Button variant="outline" className="w-full rounded-lg text-sm text-[#2d2d83] border-[#2d2d83]/20">
                      <Edit className="w-3.5 h-3.5" /> Modifier
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="rounded-lg text-red-500 hover:bg-red-50"
                    onPress={() => setDeleteId(article.id)}
                  >
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
            <p className="text-gray-400">Aucun article pour ce filtre.</p>
          </Card.Content>
        </Card>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer cet article ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteId(null)} disabled={deleting} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Annuler
            </button>
            <button onClick={handleDelete} disabled={deleting} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60">
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
