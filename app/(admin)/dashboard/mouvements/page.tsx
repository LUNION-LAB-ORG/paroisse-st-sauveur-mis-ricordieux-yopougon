"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Card, Button, Chip, SearchField, Separator } from "@heroui/react"
import { Plus, Edit, Trash2, Users, Clock, User } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { serviceAPI } from "@/features/service/apis/service.api"
import type { IService } from "@/features/service/types/service.type"

export default function MouvementsPage() {
  const [services, setServices] = useState<IService[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    serviceAPI
      .obtenirTous()
      .then((res) => setServices(res.data ?? []))
      .catch(() => toast.error("Erreur lors du chargement"))
      .finally(() => setLoading(false))
  }, [])

  const filtered = services.filter(
    (s) => !search || s.title.toLowerCase().includes(search.toLowerCase()),
  )

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await serviceAPI.supprimer(deleteId)
      setServices((prev) => prev.filter((s) => s.id !== deleteId))
      toast.success("Mouvement supprimé")
      setDeleteId(null)
    } catch {
      toast.error("Erreur lors de la suppression")
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <Header title="Mouvements & Groupes" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          icon={Users}
          value={String(services.length)}
          label="Total mouvements"
          iconBgColor="bg-[#2d2d83]/10"
          iconColor="text-[#2d2d83]"
        />
        <StatCard
          icon={User}
          value={String(services.filter((s) => !!s.leader).length)}
          label="Avec responsable"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={Clock}
          value={String(services.filter((s) => !!s.schedule).length)}
          label="Avec horaires"
          iconBgColor="bg-amber-100"
          iconColor="text-amber-600"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <SearchField className="flex-1 sm:max-w-sm" value={search} onChange={setSearch}>
          <SearchField.Group>
            <SearchField.SearchIcon />
            <SearchField.Input placeholder="Rechercher un mouvement..." />
            <SearchField.ClearButton />
          </SearchField.Group>
        </SearchField>

        <Link href="/dashboard/mouvements/new" className="sm:ml-auto">
          <Button variant="primary" className="bg-[#98141f] rounded-xl">
            <Plus className="w-4 h-4" /> Nouveau mouvement
          </Button>
        </Link>
      </div>

      {loading && <p className="text-center text-gray-400 py-12">Chargement...</p>}

      {!loading && filtered.length === 0 && (
        <Card className="p-12">
          <Card.Content className="text-center">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun mouvement enregistré.</p>
          </Card.Content>
        </Card>
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((s) => (
            <Card key={s.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#2d2d83] to-[#2d2d83]/70">
                {s.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-14 h-14 text-white/80" />
                  </div>
                )}
              </div>

              <Card.Content className="p-5">
                <Card.Title className="text-base font-bold text-[#2d2d83] mb-2 line-clamp-2">
                  {s.title}
                </Card.Title>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">{s.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {s.leader && (
                    <Chip variant="soft" color="default" size="sm">
                      <User className="w-3 h-3 mr-1" /> {s.leader}
                    </Chip>
                  )}
                  {s.schedule && (
                    <Chip variant="soft" color="accent" size="sm">
                      <Clock className="w-3 h-3 mr-1" /> {s.schedule}
                    </Chip>
                  )}
                </div>

                <Separator className="mb-3" />

                <div className="flex gap-2">
                  <Link href={`/dashboard/mouvements/${s.id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full rounded-lg text-sm text-[#2d2d83] border-[#2d2d83]/20"
                    >
                      <Edit className="w-3.5 h-3.5" /> Modifier
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    className="rounded-lg text-red-500 hover:bg-red-50"
                    onPress={() => setDeleteId(s.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer ce mouvement ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          <DialogFooter>
            <button
              onClick={() => setDeleteId(null)}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-60"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
