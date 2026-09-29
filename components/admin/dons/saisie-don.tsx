"use client";

import type { IDonPaymethod } from "@/features/don/types/don.type";

import { toast } from "@heroui/react";
import { useState } from "react";

import { FenetreAdmin } from "@/components/admin/demandes/elements";
import {
  BoutonAdmin,
  CaseAdmin,
  ChampChoixAdmin,
  ChampTexteAdmin,
  ChampZoneAdmin,
} from "@/components/admin/ui/kit";
import {
  erreursChamps,
  messageErreur,
} from "@/features/admin/utils/reponse-api";
import { useSaisirDonMutation } from "@/features/don/queries/don-admin.query";
import { useSettings } from "@/features/setting/hooks/useSettings";
import { dateDuJour, formatMontant } from "@/lib/charte";

const MOYENS_SAISIE: { valeur: IDonPaymethod; label: string }[] = [
  { valeur: "especes", label: "Espèces" },
  { valeur: "cheque", label: "Chèque" },
  { valeur: "virement", label: "Virement" },
  { valeur: "wave", label: "Wave" },
  { valeur: "orange_money", label: "Orange Money" },
  { valeur: "mtn", label: "MTN MoMo" },
  { valeur: "autre", label: "Autre" },
];

const vide = () => ({
  donator: "",
  amount: "",
  paymethod: "especes" as IDonPaymethod,
  donation_at: dateDuJour(),
  project: "",
  paytransaction: "",
  display_name: false,
  description: "",
});

/** « + Saisir un don reçu » : encaissement hors ligne (quête, espèces, chèque…). */
export function SaisieDon({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  const { settings } = useSettings();
  const projetParDefaut =
    settings["donation.project_label"] || "Nouvelle église";
  const [f, setF] = useState(vide);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const saisir = useSaisirDonMutation();

  const maj = <K extends keyof ReturnType<typeof vide>>(
    k: K,
    v: ReturnType<typeof vide>[K],
  ) => {
    setF((p) => ({ ...p, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: "" }));
  };

  const fermer = () => {
    setF(vide());
    setErreurs({});
    onFermer();
  };

  const montant = Number(f.amount.replace(/[^\d]/g, "") || 0);

  const envoyer = () => {
    const e: Record<string, string> = {};

    if (!f.donator.trim())
      e.donator =
        "Indiquez le donateur (ou « Anonyme », « Quête du dimanche »…).";
    if (!montant) e.amount = "Indiquez le montant reçu.";
    if (!f.donation_at) e.donation_at = "Indiquez la date de réception.";
    else if (f.donation_at > dateDuJour())
      e.donation_at = "La date ne peut pas être dans le futur.";
    setErreurs(e);
    if (Object.keys(e).length) return;
    saisir.mutate(
      {
        donator: f.donator.trim(),
        amount: montant,
        paymethod: f.paymethod,
        donation_at: f.donation_at,
        project: f.project.trim() || projetParDefaut,
        paytransaction: f.paytransaction.trim() || null,
        description: f.description.trim() || null,
        display_name: f.display_name,
        donation_type: "monetaire",
        payment_status: "succeeded",
      },
      {
        onSuccess: fermer,
        onError: (err) => {
          setErreurs(erreursChamps(err));
          toast.danger(
            messageErreur(err, "Le don n’a pas pu être enregistré."),
          );
        },
      },
    );
  };

  return (
    <FenetreAdmin
      ouverte={ouverte}
      pied={
        <>
          <BoutonAdmin variante="neutre" onPress={fermer}>
            Annuler
          </BoutonAdmin>
          <BoutonAdmin
            isPending={saisir.isPending}
            variante="primaire"
            onPress={envoyer}
          >
            Enregistrer le don
          </BoutonAdmin>
        </>
      }
      sousTitre="Le don est enregistré comme payé et compte dans le montant affiché sur le site."
      titre="Saisir un don reçu"
      onFermer={fermer}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChampTexteAdmin
          className="sm:col-span-2"
          erreur={erreurs.donator}
          label="Donateur"
          placeholder="Ex. Quête du dimanche, Famille Kouassi"
          value={f.donator}
          onChange={(v) => maj("donator", v)}
        />
        <ChampTexteAdmin
          aide={montant ? `${formatMontant(montant)} FCFA` : undefined}
          erreur={erreurs.amount}
          label="Montant (FCFA)"
          value={f.amount}
          onChange={(v) => maj("amount", v.replace(/[^\d\s]/g, ""))}
        />
        <ChampChoixAdmin
          label="Moyen"
          options={MOYENS_SAISIE}
          value={f.paymethod}
          onChange={(v) => maj("paymethod", (v || "especes") as IDonPaymethod)}
        />
        <ChampTexteAdmin
          erreur={erreurs.donation_at}
          label="Date de réception"
          type="date"
          value={f.donation_at}
          onChange={(v) => maj("donation_at", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.project}
          label="Projet"
          placeholder={projetParDefaut}
          value={f.project}
          onChange={(v) => maj("project", v)}
        />
        <ChampTexteAdmin
          className="sm:col-span-2"
          erreur={erreurs.paytransaction}
          label="Référence (facultatif)"
          placeholder="N° de chèque, de reçu ou de transaction"
          value={f.paytransaction}
          onChange={(v) => maj("paytransaction", v)}
        />
        <ChampZoneAdmin
          className="sm:col-span-2"
          label="Note (facultatif)"
          rows={2}
          value={f.description}
          onChange={(v) => maj("description", v)}
        />
        <CaseAdmin
          className="sm:col-span-2"
          valeur={f.display_name}
          onChange={(v) => maj("display_name", v)}
        >
          Faire figurer le nom parmi les bienfaiteurs
        </CaseAdmin>
      </div>
    </FenetreAdmin>
  );
}
