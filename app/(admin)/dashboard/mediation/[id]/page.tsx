"use client"

import { ArrowLeft, Save, Eye, Trash2, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Card, Button, TextField, Label, Input, TextArea } from "@heroui/react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function MeditationDetailPage() {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [title, setTitle] = useState("La miséricorde divine dans notre quotidien")
  const [category, setCategory] = useState("Enseignement spirituel")
  const [content, setContent] = useState(
    "La miséricorde est au cœur du message évangélique. Dans notre quotidien, elle se manifeste par des gestes simples : un sourire, une parole d'encouragement, un pardon accordé..."
  )
  const [status, setStatus] = useState("published")

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/mediation" className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d2d83]">Modifier la méditation</h1>
            <p className="text-sm text-gray-500">Dernière modification : 28/04/2025</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl text-gray-600"><Eye className="w-4 h-4" /> Prévisualiser</Button>
          <Button variant="primary" className="bg-[#98141f] rounded-xl"><Save className="w-4 h-4" /> Publier</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <Card.Content className="p-6 space-y-5">
              <TextField value={title} onChange={setTitle}>
                <Label>Titre</Label>
                <Input placeholder="Titre de la méditation..." />
              </TextField>
              <TextField value={content} onChange={setContent}>
                <Label>Contenu</Label>
                <TextArea placeholder="Rédigez votre méditation..." rows={14} />
              </TextField>
            </Card.Content>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83]">Paramètres</Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5 space-y-4">
              <TextField value={category} onChange={setCategory}>
                <Label>Catégorie</Label>
                <Input placeholder="Enseignement, Vie familiale..." />
              </TextField>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <div className="flex gap-2">
                  <button onClick={() => setStatus("published")} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${status === "published" ? "bg-green-100 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500"}`}>Publié</button>
                  <button onClick={() => setStatus("draft")} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${status === "draft" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-gray-50 text-gray-500"}`}>Brouillon</button>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card>
            <Card.Header className="px-5 pt-5 pb-3">
              <Card.Title className="text-sm font-semibold text-[#2d2d83]">Image</Card.Title>
            </Card.Header>
            <Card.Content className="px-5 pb-5">
              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#2d2d83]/30 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Ajouter une image</p>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </Card.Content>
          </Card>

          <Card className="border-red-100">
            <Card.Content className="p-5">
              <Button variant="ghost" className="w-full rounded-xl text-red-500 hover:bg-red-50 border border-red-200" onPress={() => setDeleteOpen(true)}>
                <Trash2 className="w-4 h-4" /> Supprimer
              </Button>
            </Card.Content>
          </Card>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle className="text-red-600">Supprimer ?</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-500">Cette action est irréversible.</p>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setDeleteOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Annuler</button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Supprimer</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
