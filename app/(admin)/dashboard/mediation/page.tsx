"use client"

import { useState } from "react"
import { BookOpen, Plus, Eye, Calendar, User, Edit, Trash2 } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Card, Button, Chip, Separator, SearchField } from "@heroui/react"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const meditations = [
  { id: 1, titre: "La miséricorde divine dans notre quotidien", date: "28/04/2025", auteur: "Père François", categorie: "Enseignement spirituel", statut: "published" as const, statutLabel: "Publié", vues: 124 },
  { id: 2, titre: "L'importance de la prière en famille", date: "25/04/2025", auteur: "Père Jean", categorie: "Vie familiale", statut: "published" as const, statutLabel: "Publié", vues: 98 },
  { id: 3, titre: "Le carême: un temps de conversion", date: "20/04/2025", auteur: "Père François", categorie: "Temps liturgique", statut: "published" as const, statutLabel: "Publié", vues: 156 },
  { id: 4, titre: "Méditation sur les Béatitudes", date: "15/04/2025", auteur: "Sœur Marie", categorie: "Enseignement spirituel", statut: "draft" as const, statutLabel: "Brouillon", vues: 0 },
  { id: 5, titre: "Vivre l'Évangile au quotidien", date: "10/04/2025", auteur: "Père Jean", categorie: "Vie chrétienne", statut: "published" as const, statutLabel: "Publié", vues: 87 },
  { id: 6, titre: "Le sacrement de la réconciliation", date: "05/04/2025", auteur: "Père François", categorie: "Sacrements", statut: "draft" as const, statutLabel: "Brouillon", vues: 0 },
]

export default function MediationPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = meditations
    .filter((m) => filter === "all" || m.statut === filter)
    .filter((m) => !search || m.titre.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <Header title="Méditations" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={BookOpen} value={String(meditations.length)} label="Total" iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Eye} value={String(meditations.reduce((s, m) => s + m.vues, 0))} label="Lectures" trend="15%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={BookOpen} value={String(meditations.filter((m) => m.statut === "draft").length)} label="Brouillons" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <Card key={m.id} className="hover:shadow-md transition-shadow">
            <Card.Content className="p-5">
              <div className="flex items-center justify-between mb-3">
                <Chip variant="soft" color="default" size="sm">{m.categorie}</Chip>
                <StatusBadge status={m.statut} label={m.statutLabel} />
              </div>
              <Card.Title className="text-base font-bold text-[#2d2d83] mb-2 line-clamp-2">{m.titre}</Card.Title>
              <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {m.auteur}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {m.date}</span>
                {m.vues > 0 && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {m.vues}</span>}
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

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">Supprimer ?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Annuler</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Supprimer</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
