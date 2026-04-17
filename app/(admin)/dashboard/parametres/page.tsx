"use client"

import { Settings, Church, Clock, Bell, Globe, ImageIcon, Save } from "lucide-react"
import { Header } from "@/components/admin/header"
import { Card, Button, TextField, Label, Input, TextArea, Separator, Switch } from "@heroui/react"

export default function ParametresPage() {
  return (
    <div>
      <Header title="Paramètres" />

      {/* Row 1 : Infos paroisse + Logo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Infos - 2/3 */}
        <Card className="lg:col-span-2">
          <Card.Header className="px-6 pt-6 pb-3">
            <div className="flex items-center gap-2">
              <Church className="w-5 h-5 text-[#2d2d83]" />
              <Card.Title className="text-base font-semibold text-[#2d2d83]">Informations</Card.Title>
            </div>
          </Card.Header>
          <Card.Content className="px-6 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField defaultValue="Paroisse Saint Sauveur Miséricordieux" className="sm:col-span-2">
                <Label>Nom</Label>
                <Input />
              </TextField>
              <TextField defaultValue="Yopougon Millionnaire, Abidjan">
                <Label>Adresse</Label>
                <Input />
              </TextField>
              <TextField defaultValue="+225 07 00 00 00 00">
                <Label>Téléphone</Label>
                <Input type="tel" />
              </TextField>
              <TextField defaultValue="contact@paroisse-stsauveur.ci">
                <Label>Email</Label>
                <Input type="email" />
              </TextField>
              <TextField defaultValue="https://paroisse-stsauveur.ci">
                <Label>Site web</Label>
                <Input type="url" />
              </TextField>
              <TextField defaultValue="La Paroisse Saint Sauveur Miséricordieux est une communauté catholique..." className="sm:col-span-2">
                <Label>Description</Label>
                <TextArea rows={2} />
              </TextField>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="primary" className="bg-[#98141f] rounded-xl"><Save className="w-4 h-4" /> Enregistrer</Button>
            </div>
          </Card.Content>
        </Card>

        {/* Logo - 1/3 */}
        <Card>
          <Card.Header className="px-6 pt-6 pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#2d2d83]" />
              <Card.Title className="text-base font-semibold text-[#2d2d83]">Identité visuelle</Card.Title>
            </div>
          </Card.Header>
          <Card.Content className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#2d2d83]/30 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-300 mb-1" />
                <span className="text-xs text-gray-500">Changer</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero</label>
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-[#2d2d83]/30 transition-colors cursor-pointer">
                <ImageIcon className="w-8 h-8 text-gray-300 mb-1" />
                <span className="text-xs text-gray-500">Changer</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Row 2 : Horaires + Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Horaires */}
        <Card>
          <Card.Header className="px-6 pt-6 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#2d2d83]" />
              <Card.Title className="text-base font-semibold text-[#2d2d83]">Horaires</Card.Title>
            </div>
            <Card.Description>Affichés sur la page d&apos;accueil</Card.Description>
          </Card.Header>
          <Card.Content className="px-6 pb-6 space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Dimanche</h3>
              <div className="grid grid-cols-3 gap-2">
                <TextField defaultValue="06:30"><Label>M1</Label><Input type="time" /></TextField>
                <TextField defaultValue="10:00"><Label>M2</Label><Input type="time" /></TextField>
                <TextField defaultValue="18:00"><Label>M3</Label><Input type="time" /></TextField>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Semaine</h3>
              <div className="grid grid-cols-2 gap-2">
                <TextField defaultValue="06:30"><Label>Matin</Label><Input type="time" /></TextField>
                <TextField defaultValue="18:00"><Label>Soir</Label><Input type="time" /></TextField>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sacrements</h3>
              <div className="grid grid-cols-2 gap-2">
                <TextField defaultValue="Sam 16h-17h30"><Label>Confession</Label><Input /></TextField>
                <TextField defaultValue="Jeu 18h-19h30"><Label>Adoration</Label><Input /></TextField>
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" className="bg-[#98141f] rounded-xl"><Save className="w-4 h-4" /> Mettre à jour</Button>
            </div>
          </Card.Content>
        </Card>

        {/* Notifications */}
        <Card>
          <Card.Header className="px-6 pt-6 pb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#2d2d83]" />
              <Card.Title className="text-base font-semibold text-[#2d2d83]">Notifications</Card.Title>
            </div>
          </Card.Header>
          <Card.Content className="px-6 pb-6">
            <div className="space-y-0 divide-y divide-gray-50">
              {[
                { label: "Demandes de messe", desc: "Chaque nouvelle demande" },
                { label: "Demandes d'écoute", desc: "Quand un paroissien demande" },
                { label: "Nouveaux dons", desc: "Chaque don reçu" },
                { label: "Inscriptions événements", desc: "Nouvelle inscription" },
                { label: "Résumé par email", desc: "Récapitulatif quotidien" },
                { label: "Alertes système", desc: "Maintenance et mises à jour" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="min-w-0 mr-3">
                    <p className="text-sm font-medium text-gray-800">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <Switch defaultSelected className="shrink-0">
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                  </Switch>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="primary" className="bg-[#98141f] rounded-xl"><Save className="w-4 h-4" /> Enregistrer</Button>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Row 3 : Apparence - pleine largeur */}
      <Card>
        <Card.Header className="px-6 pt-6 pb-3">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#2d2d83]" />
            <Card.Title className="text-base font-semibold text-[#2d2d83]">Apparence</Card.Title>
          </div>
        </Card.Header>
        <Card.Content className="px-6 pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-800">Mode sombre</p>
                <p className="text-xs text-gray-400">Thème sombre pour le dashboard</p>
              </div>
              <Switch className="shrink-0">
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Couleur principale</p>
              <div className="flex gap-3">
                {[
                  { color: "#2d2d83", label: "Navy" },
                  { color: "#1a365d", label: "Marine" },
                  { color: "#4a1942", label: "Prune" },
                  { color: "#1e3a2f", label: "Forêt" },
                ].map((c) => (
                  <button key={c.color} className="w-9 h-9 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-colors" style={{ backgroundColor: c.color }} title={c.label} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Couleur accent</p>
              <div className="flex gap-3">
                {[
                  { color: "#98141f", label: "Burgundy" },
                  { color: "#c49a2a", label: "Or" },
                  { color: "#b45309", label: "Ambre" },
                  { color: "#047857", label: "Emeraude" },
                ].map((c) => (
                  <button key={c.color} className="w-9 h-9 rounded-xl border-2 border-gray-200 hover:border-gray-400 transition-colors" style={{ backgroundColor: c.color }} title={c.label} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="primary" className="bg-[#98141f] rounded-xl"><Save className="w-4 h-4" /> Enregistrer</Button>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}
