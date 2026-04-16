"use client"

import { useState } from "react"
import { Calendar, Pencil, Trash2 } from "lucide-react"
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
    titre: "La miséricorde divine dans notre quotidien",
    date: "28/04/2025",
    auteur: "Père François",
    categorie: "Enseignement spirituel",
    statut: "published",
    statutLabel: "Publié",
    vues: 124,
  },
  {
    titre: "L'importance de la prière en famille",
    date: "25/04/2025",
    auteur: "Père Jean",
    categorie: "Vie familiale",
    statut: "published",
    statutLabel: "Publié",
    vues: 98,
  },
  {
    titre: "Le carême: un temps de conversion",
    date: "20/04/2025",
    auteur: "Père François",
    categorie: "Temps liturgique",
    statut: "published",
    statutLabel: "Publié",
    vues: 156,
  },
  {
    titre: "Méditation sur les Béatitudes",
    date: "15/04/2025",
    auteur: "Sœur Marie",
    categorie: "Enseignement spirituel",
    statut: "draft",
    statutLabel: "Brouillon",
    vues: 0,
  },
  {
    titre: "La joie de servir",
    date: "10/04/2025",
    auteur: "Père François",
    categorie: "Service",
    statut: "published",
    statutLabel: "Publié",
    vues: 87,
  },
  {
    titre: "L'Eucharistie, source de vie",
    date: "05/04/2025",
    auteur: "Père Jean",
    categorie: "Sacrements",
    statut: "published",
    statutLabel: "Publié",
    vues: 142,
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
      <StatusBadge status={row.statut as "published" | "draft"} label={row.statutLabel as string} />
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

export default function MediationPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <Header title="Dashboard Méditations" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard icon={Calendar} value="05" label="Total Méditations" trend="12%" trendUp />
        <StatCard icon={Calendar} value="05" label="Méditations publiées" trend="12%" trendUp />
        <StatCard icon={Calendar} value="01" label="Brouillons" trend="12%" trendUp />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h2 className="text-lg lg:text-xl font-bold text-[#2d2d83]">Méditations</h2>
        <Button onClick={() => setIsOpen(true)} className="bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px] w-full sm:w-auto">
          + Nouvelle méditation
        </Button>
      </div>

      <DataTable columns={columns} data={tableData} itemsPerPage={5} />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#2d2d83]">Nouvelle Méditation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium">Titre de la méditation</label>
              <Input placeholder="Nom" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Auteur</label>
              <Input placeholder="Nom" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Catégorie</label>
              <Input placeholder="Nom" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Statut</label>
              <Input placeholder="Nom" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Date de publication</label>
              <Input placeholder="Nom" type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Image principale (optionnel)</label>
              <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Choisir un fichier
                </Button>
                <span className="text-sm text-muted-foreground">Aucun fichier choisi</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <div className="mt-1 flex items-center gap-2 mb-2">
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <span className="font-bold">B</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <span className="italic">I</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <span className="underline">U</span>
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8 bg-transparent">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </Button>
              </div>
              <Textarea placeholder="Nom" className="min-h-[120px]" />
            </div>
            <Button className="w-full bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px]">Publier</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
