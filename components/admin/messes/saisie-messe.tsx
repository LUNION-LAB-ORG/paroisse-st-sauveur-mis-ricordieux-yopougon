"use client";

import type { IFormuleMesse } from "@/features/messe/types/messe-admin.type";

import { toast } from "@heroui/react";
import { useState } from "react";

import { ChoixCreneau } from "./choix-creneau";
import { FORMULES, TYPES_INTENTION } from "./libelles";

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
import {
  useDisponibilitesMesseQuery,
  useSaisirMesseMutation,
} from "@/features/messe/queries/messe-admin.query";
import { dateDuJour, formatMontant } from "@/lib/charte";

const VIDE = {
  intention_type: "",
  for_whom: "",
  intention: "",
  is_confidential: false,
  formula: "single" as IFormuleMesse,
  date: "",
  time_slot_id: null as number | null,
  fullname: "",
  phone: "",
  email: "",
  will_attend: false,
  reminder: true,
  offering: "indicative" as "indicative" | "free",
  amount: "",
  payment_method: "secretariat" as "secretariat" | "cash",
};

/** « + Saisir une demande » : demande reçue au secrétariat (sans délai minimal). */
export function SaisieMesse({
  ouverte,
  onFermer,
}: {
  ouverte: boolean;
  onFermer: () => void;
}) {
  const [f, setF] = useState(VIDE);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const dispo = useDisponibilitesMesseQuery(dateDuJour(), ouverte);
  const saisir = useSaisirMesseMutation();
  const d = dispo.data?.data;
  const indicative = d?.offering_amount ?? null;
  const offrande =
    indicative && f.offering === "indicative" ? "indicative" : "free";
  const n = FORMULES[f.formula].n;

  const maj = <K extends keyof typeof VIDE>(k: K, v: (typeof VIDE)[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: "" }));
  };

  const fermer = () => {
    setF(VIDE);
    setErreurs({});
    onFermer();
  };

  const valider = () => {
    const e: Record<string, string> = {};

    if (!f.intention_type) e.intention_type = "Choisissez le type d’intention.";
    if (!f.for_whom.trim()) e.for_whom = "Indiquez pour qui la messe est dite.";
    if (!f.date || !f.time_slot_id) e.time_slot_id = "Choisissez la messe.";
    if (!f.fullname.trim()) e.fullname = "Indiquez le nom du demandeur.";
    if (f.phone.replace(/\D/g, "").length < 8)
      e.phone = "Numéro WhatsApp incomplet.";
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email))
      e.email = "Adresse e-mail invalide.";
    if (offrande === "free") {
      const m = Number(f.amount.replace(/\s/g, ""));

      if (!f.amount || Number.isNaN(m) || m <= 0)
        e.amount = "Indiquez le montant de l’offrande.";
      else if (d && m < d.min_offering)
        e.amount = `Minimum : ${formatMontant(d.min_offering)} FCFA.`;
    }
    setErreurs(e);

    return Object.keys(e).length === 0;
  };

  const envoyer = () => {
    if (!valider()) return;
    saisir.mutate(
      {
        intention_type: f.intention_type,
        for_whom: f.for_whom.trim(),
        intention: f.intention.trim() || undefined,
        is_confidential: f.is_confidential,
        formula: f.formula,
        date: f.date,
        time_slot_id: f.time_slot_id!,
        fullname: f.fullname.trim(),
        phone: f.phone.trim(),
        email: f.email.trim() || undefined,
        will_attend: f.will_attend,
        reminder: f.reminder,
        offering: offrande,
        amount:
          offrande === "free" ? Number(f.amount.replace(/\s/g, "")) : undefined,
        payment_method: f.payment_method,
      },
      {
        onSuccess: fermer,
        onError: (err) => {
          const champs = erreursChamps(err);

          if (champs.date && !champs.time_slot_id)
            champs.time_slot_id = champs.date;
          setErreurs(champs);
          toast.danger(
            messageErreur(err, "La demande n’a pas pu être enregistrée."),
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
            Enregistrer la demande
          </BoutonAdmin>
        </>
      }
      sousTitre="Demande reçue au secrétariat : aucun délai minimal ne s’applique."
      taille="lg"
      titre="Saisir une demande de messe"
      onFermer={fermer}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChampChoixAdmin
          erreur={erreurs.intention_type}
          label="Intention"
          options={TYPES_INTENTION.map((t) => ({ valeur: t, label: t }))}
          placeholder="Choisir"
          value={f.intention_type}
          onChange={(v) => maj("intention_type", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.for_whom}
          label="Pour"
          maxLength={150}
          placeholder="Ex. Feu Jean K."
          value={f.for_whom}
          onChange={(v) => maj("for_whom", v)}
        />
        <ChampZoneAdmin
          compteur
          className="sm:col-span-2"
          erreur={erreurs.intention}
          label="Texte de l’intention"
          maxLength={250}
          rows={3}
          value={f.intention}
          onChange={(v) => maj("intention", v)}
        />
        <CaseAdmin
          className="sm:col-span-2"
          valeur={f.is_confidential}
          onChange={(v) => maj("is_confidential", v)}
        >
          Intention confidentielle (noms non lus à voix haute)
        </CaseAdmin>
        <ChampChoixAdmin
          label="Formule"
          options={Object.entries(FORMULES).map(([k, v]) => ({
            valeur: k,
            label: v.label,
          }))}
          value={f.formula}
          onChange={(v) => maj("formula", (v || "single") as IFormuleMesse)}
        />
        <span className="self-end pb-3 text-[13px] text-gris">
          {n > 1
            ? `${n} messes à la même heure, jours consécutifs à partir de la date choisie.`
            : "Une seule messe à la date choisie."}
        </span>
        <div className="sm:col-span-2">
          <ChoixCreneau
            chargement={dispo.isLoading}
            creneau={f.time_slot_id}
            date={f.date}
            dispo={d}
            erreur={erreurs.time_slot_id}
            erreurChargement={dispo.isError}
            onChange={(date, c) => {
              setF((p) => ({ ...p, date, time_slot_id: c }));
              setErreurs((e) => ({ ...e, time_slot_id: "" }));
            }}
          />
        </div>
        <ChampTexteAdmin
          autoComplete="off"
          erreur={erreurs.fullname}
          label="Demandeur"
          value={f.fullname}
          onChange={(v) => maj("fullname", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.phone}
          label="WhatsApp"
          placeholder="+225 07 00 00 00 00"
          type="tel"
          value={f.phone}
          onChange={(v) => maj("phone", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.email}
          label="E-mail (facultatif)"
          type="email"
          value={f.email}
          onChange={(v) => maj("email", v)}
        />
        <ChampChoixAdmin
          label="Paiement"
          options={[
            { valeur: "secretariat", label: "À régler au secrétariat" },
            { valeur: "cash", label: "Espèces reçues" },
          ]}
          value={f.payment_method}
          onChange={(v) =>
            maj(
              "payment_method",
              (v || "secretariat") as "secretariat" | "cash",
            )
          }
        />
        {indicative ? (
          <ChampChoixAdmin
            label="Offrande"
            options={[
              {
                valeur: "indicative",
                label: `Indicative : ${n} × ${formatMontant(indicative)} = ${formatMontant(n * indicative)} FCFA`,
              },
              { valeur: "free", label: "Montant libre" },
            ]}
            value={f.offering}
            onChange={(v) =>
              maj("offering", (v || "indicative") as "indicative" | "free")
            }
          />
        ) : null}
        {offrande === "free" && (
          <ChampTexteAdmin
            erreur={erreurs.amount}
            label="Montant de l’offrande (FCFA)"
            type="number"
            value={f.amount}
            onChange={(v) => maj("amount", v)}
          />
        )}
        <div className="flex flex-col gap-2.5 sm:col-span-2">
          <CaseAdmin
            valeur={f.will_attend}
            onChange={(v) => maj("will_attend", v)}
          >
            Le demandeur assistera à la messe
          </CaseAdmin>
          <CaseAdmin valeur={f.reminder} onChange={(v) => maj("reminder", v)}>
            Rappel la veille (dès que WhatsApp Business sera configuré)
          </CaseAdmin>
        </div>
      </div>
    </FenetreAdmin>
  );
}
