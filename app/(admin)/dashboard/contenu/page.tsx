"use client"

import { FileText, Image as ImageIcon, File, ExternalLink, Settings } from "lucide-react"
import { Header } from "@/components/admin/header"
import { Card, Button, Chip, Separator } from "@heroui/react"
import Link from "next/link"

const pages = [
  { nom: "Page d'accueil", route: "/", statut: "active", sections: 5, derniereMaj: "15/04/2025" },
  { nom: "Faire un don", route: "/faire-don", statut: "active", sections: 3, derniereMaj: "12/04/2025" },
  { nom: "Mouvement", route: "/mouvement", statut: "active", sections: 4, derniereMaj: "10/04/2025" },
  { nom: "Méditations", route: "/meditations", statut: "active", sections: 2, derniereMaj: "08/04/2025" },
  { nom: "Actualités", route: "/actualites", statut: "active", sections: 2, derniereMaj: "05/04/2025" },
  { nom: "Historique", route: "/historique", statut: "active", sections: 3, derniereMaj: "01/04/2025" },
  { nom: "Équipes", route: "/equipes", statut: "active", sections: 3, derniereMaj: "28/03/2025" },
  { nom: "Conseils paroissiaux", route: "/conseils-paroissiaux", statut: "active", sections: 3, derniereMaj: "25/03/2025" },
]

const medias = [
  { type: "Images", count: 24, icon: ImageIcon, color: "bg-blue-100 text-blue-600" },
  { type: "Documents", count: 8, icon: File, color: "bg-amber-100 text-amber-600" },
  { type: "Pages", count: pages.length, icon: FileText, color: "bg-[#2d2d83]/10 text-[#2d2d83]" },
]

export default function ContenuPage() {
  return (
    <div>
      <Header title="Gestion du Contenu" />

      {/* Media overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {medias.map((m) => (
          <Card key={m.type} className="hover:shadow-md transition-shadow">
            <Card.Content className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${m.color}`}>
                <m.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{m.count}</p>
                <p className="text-sm text-gray-500">{m.type}</p>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Pages list */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-[#2d2d83]">Pages du site</h2>
        <p className="text-sm text-gray-500">Gerez le contenu des pages publiques</p>
      </div>

      <div className="space-y-2">
        {pages.map((page) => (
          <Card key={page.route} className="hover:shadow-md transition-shadow">
            <Card.Content className="px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#2d2d83]/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#2d2d83]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-800">{page.nom}</h3>
                    <Chip variant="soft" color="success" size="sm">Actif</Chip>
                  </div>
                  <p className="text-xs text-gray-400">{page.sections} sections · Mis à jour le {page.derniereMaj}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={page.route}
                    target="_blank"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-[#2d2d83]"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Button variant="outline" className="rounded-lg text-sm text-[#2d2d83] border-[#2d2d83]/20">
                    <Settings className="w-3.5 h-3.5" /> Gérer
                  </Button>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  )
}
