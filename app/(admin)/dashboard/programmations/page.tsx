"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Card, Button, Chip, SearchField, Switch } from "@heroui/react"
import {
  CalendarHeart,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Clock,
} from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { programmationAPI } from "@/features/programmation/apis/programmation.api"
import {
  IProgrammation,
  PROGRAMMATION_CATEGORIES,
} from "@/features/programmation/types/programmation.type"

function formatDateFR(iso?: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
}

function formatTimeFR(iso?: string | null): string {
  if (!iso) return ""
  if (/^\d{2}:\d{2}/.test(iso)) return iso.slice(0, 5)
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false })
}

export default function ProgrammationsPage() {
  const [items, setItems] = useState<IProgrammation[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [toDelete, setToDelete] = useState<IProgrammation | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    try {
      const res = await programmationAPI.obtenirTous({ all: "1", per_page: "100" })
      setItems((res.data ?? []) as IProgrammation[])
    } catch {
      toast.error("Erreur chargement")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return items
      .filter((p) => filterCategory === "all" || p.category === filterCategory)
      .filter((p) => !search || p.name.toLowerCase().includes(search.toLowerCase()))
  }, [items, search, filterCategory])

  const counts = useMemo(() => {
    const now = new Date()
    return {
      total: items.length,
      published: items.filter((p) => p.is_published).length,
      upcoming: items.filter((p) => p.date_at && new Date(p.date_at) >= now).length,
    }
  }, [items])

  const togglePublished = async (p: IProgrammation) => {
    try {
      const res = await programmationAPI.modifier(p.id, { is_published: !p.is_published })
      setItems((prev) => prev.map((x) => (x.id === p.id ? res.data : x)))
    } catch {
      toast.error("Erreur")
    }
  }

  const remove = async () => {
    if (!toDelete) return
    setDeleting(true)
    try {
      await programmationAPI.supprimer(toDelete.id)
      setItems((prev) => prev.filter((x) => x.id !== toDelete.id))
      toast.success("Programmation supprimée")
      setToDelete(null)
    } catch {
      toast.error("Erreur")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <Header title="Programmations liturgiques" />

      <p className="text-sm text-gray-500 mb-6 max-w-3xl">
        Annoncez les temps liturgiques forts de la paroisse : Triduum pascal, Octave de Noël, Mois marial,
        Retraite annuelle, fête patronale… Les fidèles consultent ces programmes sur la page publique.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={CalendarHeart} value={String(counts.total)} label="Total" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={CalendarHeart} value={String(counts.published)} label="Publiées" iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Clock} value={String(counts.upcoming)} label="À venir" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <SearchField className="flex-1 md:max-w-sm" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm"
        >
          <option value="all">Toutes les catégories</option>
          {PROGRAMMATION_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <Link href="/dashboard/programmations/new" className="md:ml-auto">
          <Button variant="primary" className="bg-[#98141f] rounded-xl">
            <Plus className="w-4 h-4" /> Nouvelle programmation
          </Button>
        </Link>
      </div>

      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

      {!loading && filtered.length === 0 && (
        <Card className="p-12">
          <Card.Content className="text-center">
            <CalendarHeart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune programmation pour ces filtres.</p>
          </Card.Content>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <Card key={p.id} className={`overflow-hidden ${!p.is_published ? "opacity-60" : ""}`}>
              <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#2d2d83] to-[#2d2d83]/70">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CalendarHeart className="w-14 h-14 text-white/80" />
                  </div>
                )}
                {!p.is_published && (
                  <div className="absolute top-3 right-3">
                    <Chip variant="soft" color="danger" size="sm">Brouillon</Chip>
                  </div>
                )}
              </div>

              <Card.Content className="p-5">
                {p.category && (
                  <Chip variant="soft" color="default" size="sm" className="mb-2">
                    {p.category}
                  </Chip>
                )}
                <Card.Title className="text-base font-bold text-[#2d2d83] mb-2 line-clamp-2">
                  {p.name}
                </Card.Title>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description}</p>

                <div className="flex flex-col gap-1 text-xs text-gray-500 mb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarHeart className="w-3 h-3" /> {formatDateFR(p.date_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {formatTimeFR(p.started_at)}
                    {p.ended_at && ` – ${formatTimeFR(p.ended_at)}`}
                  </span>
                  {p.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" /> {p.location}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Switch isSelected={p.is_published} onChange={() => togglePublished(p)}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                    <span>{p.is_published ? "Publiée" : "Brouillon"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Link href={`/dashboard/programmations/${p.id}`}>
                      <Button variant="ghost" className="h-9 w-9 p-0 rounded-lg text-[#2d2d83] hover:bg-[#2d2d83]/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="h-9 w-9 p-0 rounded-lg text-red-500 hover:bg-red-50"
                      onPress={() => setToDelete(p)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!toDelete} onOpenChange={() => setToDelete(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer cette programmation ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500"><strong>{toDelete?.name}</strong> sera supprimée.</p>
          <DialogFooter>
            <Button variant="secondary" onPress={() => setToDelete(null)}>Annuler</Button>
            <Button variant="primary" className="bg-red-600" isDisabled={deleting} onPress={remove}>
              {deleting ? "..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
