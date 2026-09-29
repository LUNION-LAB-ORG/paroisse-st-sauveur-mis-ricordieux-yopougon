"use client";

import type { IPretre } from "@/features/pretre/types/pretre.type";

import { Button } from "@heroui/react";
import { useEffect, useState } from "react";

import { ChampChoix, ChampTexte, ChampZone } from "@/components/site/champs";
import { ecouteAPI } from "@/features/ecoute/apis/ecoute.api";

const MOTIFS = [
  "Confession",
  "Accompagnement spirituel",
  "Préparation au mariage",
  "Baptême",
  "Bénédiction de maison",
  "Autre",
].map((m) => ({ id: m, label: m }));

/** Demande de rendez-vous avec un prêtre (enregistrée dans les demandes d'écoute). */
export function FormulaireRendezVous({ pretres }: { pretres: IPretre[] }) {
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [motif, setMotif] = useState(MOTIFS[0].id);
  const [pretre, setPretre] = useState("indifferent");
  const [message, setMessage] = useState("");
  const [erreurs, setErreurs] = useState<{
    nom?: string;
    tel?: string;
    general?: string;
  }>({});
  const [envoi, setEnvoi] = useState(false);
  const [envoye, setEnvoye] = useState(false);

  // « Prendre rendez-vous » depuis une fiche prêtre présélectionne ce prêtre
  useEffect(() => {
    const surChoix = (e: Event) =>
      setPretre(String((e as CustomEvent<number>).detail));

    window.addEventListener("rdv:pretre", surChoix);

    return () => window.removeEventListener("rdv:pretre", surChoix);
  }, []);

  const options = [
    { id: "indifferent", label: "Indifférent" },
    ...pretres.map((p) => ({
      id: String(p.id),
      label: `${p.function} — ${p.fullname}`,
    })),
  ];

  const envoyer = async () => {
    const e: typeof erreurs = {};
    const numero = tel.replace(/[^\d+]/g, "");

    if (!nom.trim()) e.nom = "Indiquez votre nom.";
    if (!/^\+?\d{8,15}$/.test(numero)) e.tel = "Numéro WhatsApp invalide.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    setEnvoi(true);
    try {
      await ecouteAPI.ajouter({
        fullname: nom.trim(),
        phone: numero,
        type: motif,
        message: message.trim() || undefined,
        priest_id: pretre === "indifferent" ? null : Number(pretre),
      });
      setEnvoye(true);
    } catch (err) {
      setErreurs({
        general:
          err instanceof Error
            ? err.message
            : "La demande n’a pas pu être envoyée.",
      });
    } finally {
      setEnvoi(false);
    }
  };

  if (envoye) {
    return (
      <div
        className="flex flex-col gap-2.5 border border-[#BFE0F7] bg-[#EEF6FD] p-5"
        role="status"
      >
        <span className="text-lg font-bold text-marine">Demande envoyée</span>
        <span className="text-base text-encre-douce">
          Le secrétariat vous recontacte sur WhatsApp sous 48 heures.
        </span>
        <button
          className="min-h-11 self-start py-1 text-[15px] font-bold text-rouge underline"
          type="button"
          onClick={() => {
            setEnvoye(false);
            setMessage("");
          }}
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ChampTexte
        autoComplete="name"
        erreur={erreurs.nom}
        label="Nom et prénom"
        value={nom}
        onChange={setNom}
      />
      <ChampTexte
        autoComplete="tel"
        erreur={erreurs.tel}
        label="Numéro WhatsApp"
        placeholder="+225"
        type="tel"
        value={tel}
        onChange={setTel}
      />
      <ChampChoix
        label="Motif"
        options={MOTIFS}
        value={motif}
        onChange={setMotif}
      />
      <ChampChoix
        label="Prêtre souhaité"
        options={options}
        value={pretre}
        onChange={setPretre}
      />
      <ChampZone
        className="md:col-span-2"
        label="Message (facultatif)"
        maxLength={1000}
        value={message}
        onChange={setMessage}
      />
      {erreurs.general && (
        <p className="m-0 text-sm text-rouge md:col-span-2">
          {erreurs.general}
        </p>
      )}
      <Button
        className="h-auto min-h-11 w-full rounded-charte bg-rouge p-4 text-base font-bold text-white hover:bg-rouge-hover md:col-span-2"
        isPending={envoi}
        onPress={envoyer}
      >
        Envoyer la demande
      </Button>
    </div>
  );
}
