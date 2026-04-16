"use client"

import { useState } from "react"
import { Newspaper, Plus, Eye, Calendar, User, Edit, Trash2, Search } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Card, Button, Chip, Separator, SearchField } from "@heroui/react"
import Image from "next/image"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const articles = [
  { id: 1, titre: "Célébration de Pâques 2025", date: "15/04/2025", auteur: "Père Thomas", categorie: "Événement", statut: "published" as const, statutLabel: "Publié", vues: 256, extrait: "La paroisse célèbre Pâques avec une messe solennelle et un repas communautaire.", image: "/assets/images/projet-en-cours.jpg" },
  { id: 2, titre: "Nouvelle chorale paroissiale", date: "10/04/2025", auteur: "Père François", categorie: "Annonce", statut: "published" as const, statutLabel: "Publié", vues: 189, extrait: "Rejoignez notre nouvelle chorale ! Les répétitions ont lieu chaque samedi à 16h.", image: "/assets/images/projet-en-cours.jpg" },
  { id: 3, titre: "Journée des familles", date: "08/04/2025", auteur: "Père Thomas", categorie: "Événement", statut: "draft" as const, statutLabel: "Brouillon", vues: 0, extrait: "Une journée de rencontre et de partage pour toutes les familles de la paroisse.", image: "/assets/images/projet-en-cours.jpg" },
  { id: 4, titre: "Retraite spirituelle de Carême", date: "01/04/2025", auteur: "Père François", categorie: "Spiritualité", statut: "published" as const, statutLabel: "Publié", vues: 312, extrait: "Une journée de recueillement pour préparer son cœur à Pâques.", image: "/assets/images/projet-en-cours.jpg" },
]

export default function ActualitesPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = articles
    .filter((a) => filter === "all" || a.statut === filter)
    .filter((a) => !search || a.titre.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <Header title="Actualités" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Newspaper} value={String(articles.length)} label="Total articles" trend="12%" trendUp iconBgColor="bg-[#2d2d83]/10" iconColor="text-[#2d2d83]" />
        <StatCard icon={Eye} value={String(articles.reduce((s, a) => s + a.vues, 0))} label="Vues totales" trend="8%" trendUp iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatCard icon={Newspaper} value={String(articles.filter((a) => a.statut === "draft").length)} label="Brouillons" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
      </div>

      {/* Search + filters + add */}
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

      {/* Articles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((article) => (
          <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <Image src={article.image} alt={article.titre} fill className="object-cover" />
              <div className="absolute top-3 right-3">
                <StatusBadge status={article.statut} label={article.statutLabel} />
              </div>
            </div>

            <Card.Content className="p-4">
              <Chip variant="soft" color="default" size="sm" className="mb-2">{article.categorie}</Chip>

              <Card.Title className="text-base font-bold text-[#2d2d83] mb-1 line-clamp-2">
                {article.titre}
              </Card.Title>

              <p className="text-xs text-gray-500 line-clamp-2 mb-3">{article.extrait}</p>

              <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.auteur}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                {article.vues > 0 && <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {article.vues}</span>}
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

      {filtered.length === 0 && (
        <Card className="p-12 text-center mt-4">
          <Card.Content>
            <p className="text-gray-400">Aucun article pour ce filtre.</p>
          </Card.Content>
        </Card>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer cet article ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
              Annuler
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">
              Supprimer
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
