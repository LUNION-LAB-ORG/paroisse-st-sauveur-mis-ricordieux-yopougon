"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  data: {
    debut?:string
    fin?:string
    fullname?:string
    image?: string
    title?:string
    organisateur?: string
    type?: string
    date?: string
    heure?: string
    lieu?: string
    description?: string
    demandeur?: string
    montant?: string
    projet?: string
    modePaiement?: string
  }
}

export function DetailModal({ open, onOpenChange, title, data }: DetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          {data.image && (
            <div className="w-full aspect-video relative rounded-lg overflow-hidden">
              <Image src={data.image || "/placeholder.svg"} alt="Detail image" fill className="object-cover" />
            </div>
          )}

          {data.organisateur && (
            <div>
              <h4 className="font-semibold text-foreground">Organisateur</h4>
              <p className="text-muted-foreground">{data.organisateur}</p>
            </div>
          )}

          {data.demandeur && (
            <div>
              <h4 className="font-semibold text-foreground">Demandeur</h4>
              <p className="text-muted-foreground">{data.demandeur}</p>
            </div>
          )}

          {data.type && (
            <div>
              <h4 className="font-semibold text-foreground">{"Type d'évènement"}</h4>
              <p className="text-muted-foreground">{data.type}</p>
            </div>
          )}

          {data.montant && (
            <div>
              <h4 className="font-semibold text-foreground">Montant</h4>
              <p className="text-muted-foreground">{data.montant}</p>
            </div>
          )}

          {data.projet && (
            <div>
              <h4 className="font-semibold text-foreground">Projet</h4>
              <p className="text-muted-foreground">{data.projet}</p>
            </div>
          )}

          {data.modePaiement && (
            <div>
              <h4 className="font-semibold text-foreground">Mode de paiement</h4>
              <p className="text-muted-foreground">{data.modePaiement}</p>
            </div>
          )}

          {data.date && (
            <div>
              <h4 className="font-semibold text-foreground">Date</h4>
              <p className="text-muted-foreground">{data.date}</p>
            </div>
          )}

          {data.heure && (
            <div>
              <h4 className="font-semibold text-foreground">Heure</h4>
              <p className="text-muted-foreground">{data.heure}</p>
            </div>
          )}

          {data.lieu && (
            <div>
              <h4 className="font-semibold text-foreground">Lieu</h4>
              <p className="text-muted-foreground">{data.lieu}</p>
            </div>
          )}

          {data.description && (
            <div>
              <h4 className="font-semibold text-foreground">Description</h4>
              <p className="text-muted-foreground">{data.description}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
