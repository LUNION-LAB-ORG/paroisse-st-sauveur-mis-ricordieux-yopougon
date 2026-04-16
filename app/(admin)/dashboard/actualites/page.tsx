"use client"

import { useState } from "react"
import { Newspaper, Pencil, Trash2 } from "lucide-react"
import { Header } from "@/components/admin/header"
import { StatCard } from "@/components/admin/stat-card"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const tableData = [
  {
    titre: "Célébration de Pâques 2025",
    date: "15/04/2025",
    auteur: "Père Thomas",
    categorie: "Événement",
    statut: "published",
    statutLabel: "Publié",
    vues: 256,
  },
  {
    titre: "Nouvelle chorale paroissiale",
    date: "10/04/2025",
    auteur: "Père François",
    categorie: "Annonce",
    statut: "published",
    statutLabel: "Publié",
    vues: 189,
  },
]

const columns = [
  { key: "titre", label: "Titre" },
  { key: "date", label: "Date" },
  { key: "auteur", label: "Auteur" },
  { key: "categorie", label: "Catégorie" },
  {
    key: "statut",
    label: "Statut",
    render: (_: unknown, row: Record<string, unknown>) => (
      <StatusBadge status={row.statut as "published"} label={row.statutLabel as string} />
    ),
  },
  { key: "vues", label: "Vues" },
  {
    key: "actions",
    label: "Actions",
    render: () => (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8 text-[#2d2d83]">
          <Pencil className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    ),
  },
]

export default function ActualitesPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Header title="Gestion des Actualités" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard icon={Newspaper} value="12" label="Total Actualités" trend="12%" trendUp />
        <StatCard icon={Newspaper} value="10" label="Actualités publiées" trend="12%" trendUp />
        <StatCard icon={Newspaper} value="02" label="Brouillons" trend="12%" trendUp />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-[#2d2d83]">Actualités</h2>
        <Button onClick={() => setIsOpen(true)} className="bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px] w-full sm:w-auto">
          + Nouvelle actualité
        </Button>
      </div>

      <DataTable columns={columns} data={tableData} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Nouvelle actualité</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Titre</label>
              <Input placeholder="Titre de l'actualité" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Catégorie</label>
              <Input placeholder="Catégorie" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Image</label>
              <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Choisir un fichier
                </Button>
                <span className="text-sm text-muted-foreground">Aucun fichier choisi</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Contenu</label>
              <Textarea placeholder="Contenu de l'actualité" className="mt-1 min-h-[150px]" />
            </div>
            <Button className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px]">Publier</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
