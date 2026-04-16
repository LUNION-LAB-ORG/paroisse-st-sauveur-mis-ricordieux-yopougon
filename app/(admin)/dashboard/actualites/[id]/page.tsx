"use client"

import { ArrowLeft, Save, Eye, Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/admin/header"
import { Card, Button, TextField, Label, Input, TextArea, Select, ListBox, Chip, Separator } from "@heroui/react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ActualiteDetailPage() {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [title, setTitle] = useState("Célébration de Pâques 2025")
  const [category, setCategory] = useState("Événement")
  const [content, setContent] = useState(
    "La paroisse célèbre Pâques avec une messe solennelle et un repas communautaire pour tous les fidèles. Cette année, la chorale a préparé un programme spécial de chants liturgiques."
  )
  const [status, setStatus] = useState("published")

  return (
    <div>
      {/* Header with back + actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/actualites"
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier l&apos;article</h1>
            <p className="text-sm text-gray-500">Dernière modification : 15/04/2025</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl text-gray-600">
            <Eye className="w-4 h-4" /> Prévisualiser
          </Button>
          <Button variant="primary" className="bg-[#98141f] rounded-xl">
            <Save className="w-4 h-4" /> Publier
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main editor - 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-5">
              <TextField value={title} onChange={setTitle}>
                <Label>Titre de l&apos;article</Label>
                <Input placeholder="Titre accrocheur..." />
              </TextField>

              <TextField value={content} onChange={setContent}>
                <Label>Contenu</Label>
                <TextArea placeholder="Rédigez votre article ici..." rows={12} />
              </TextField>
            </Card.Content>
          </Card>
        </div>

        {/* Sidebar - 1/3 */}
        <div className="space-y-5">
          {/* Metadata */}
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83]">Paramètres</Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5 space-y-4">
              <TextField value={category} onChange={setCategory}>
                <Label>Catégorie</Label>
                <Input placeholder="Événement, Annonce..." />
              </TextField>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setStatus("published")}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      status === "published" ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    Publié
                  </button>
                  <button
                    onClick={() => setStatus("draft")}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                      status === "draft" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    Brouillon
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auteur</label>
                <p className="text-sm text-gray-600">Père Thomas</p>
              </div>
            </Card.Content>
          </Card>

          {/* Image */}
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83]">Image principale</Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5">
              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#2d2d83]/30 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Cliquez pour ajouter</p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </Card.Content>
          </Card>

          {/* Danger zone */}
          <Card className="border-red-100">
            <Card.Content className="p-5">
              <p className="text-sm font-medium text-red-600 mb-2">Zone danger</p>
              <Button
                variant="ghost"
                className="w-full rounded-xl text-red-500 hover:bg-red-50 border border-red-200"
                onPress={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4" /> Supprimer cet article
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Supprimer cet article ?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible. L&apos;article sera définitivement supprimé.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
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
