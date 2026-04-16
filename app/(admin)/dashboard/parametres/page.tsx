"use client"

import { Settings } from "lucide-react"
import { Header } from "@/components/admin/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ParametresPage() {
    return (
        <div>
            <Header title="Paramètres" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 shadow-sm mb-4 lg:mb-6">
                    <h2 className="text-base lg:text-lg font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
                        Informations de la paroisse
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Nom de la paroisse</label>
                            <Input defaultValue="Paroisse Saint Sauveur Miséricordieux" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Adresse</label>
                            <Input defaultValue="123 Rue de l'Église, Abidjan" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Téléphone</label>
                            <Input defaultValue="+225 07 00 00 00 00" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <Input defaultValue="contact@paroisse-stsauveur.ci" className="mt-1" />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                defaultValue="La Paroisse Saint Sauveur Miséricordieux est une communauté catholique..."
                                className="mt-1 min-h-[100px]"
                            />
                        </div>
                        <Button className="bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px] w-full sm:w-auto">
                            Enregistrer les modifications
                        </Button>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 lg:p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-base lg:text-lg font-semibold mb-4">Horaires des messes</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Dimanche matin</label>
                                <Input defaultValue="08:00" type="time" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Dimanche soir</label>
                                <Input defaultValue="18:00" type="time" className="mt-1" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Semaine (Lun-Sam)</label>
                                <Input defaultValue="06:30" type="time" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Confession</label>
                                <Input defaultValue="Samedi 16:00-17:30" className="mt-1" />
                            </div>
                        </div>
                        <Button className="bg-[#98141f] hover:bg-[#7a1019] text-white rounded-[10px] w-full sm:w-auto">
                            Mettre à jour les horaires
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
