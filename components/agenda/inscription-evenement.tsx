"use client";

import type { IEvenement } from "@/features/evenement/types/evenement.type";

import { Button } from "@heroui/react";
import { useState } from "react";

import { ChampChoix, ChampTexte } from "@/components/site/champs";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";
import { formatMontant } from "@/lib/charte";

const NOMBRES = [
  { id: "1", label: "1" },
  { id: "2", label: "2" },
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5 et plus" },
] as const;

/** Bloc « Je participe » : inscription gratuite directe, payante via Wave. */
export function InscriptionEvenement({ evenement }: { evenement: IEvenement }) {
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [nombre, setNombre] = useState("1");
  const [tarif, setTarif] = useState(evenement.pricing_tiers?.[0]?.label ?? "");
  const [erreurs, setErreurs] = useState<{
    nom?: string;
    tel?: string;
    general?: string;
  }>({});
  const [envoi, setEnvoi] = useState(false);
  const [inscrit, setInscrit] = useState(false);

  const fermee =
    (evenement.registration_deadline &&
      new Date(evenement.registration_deadline) < new Date()) ||
    (evenement.spots_remaining !== null &&
      evenement.spots_remaining !== undefined &&
      evenement.max_participants !== null &&
      evenement.spots_remaining <= 0);

  const inscrire = async () => {
    const e: typeof erreurs = {};

    if (!nom.trim()) e.nom = "Indiquez votre nom.";
    if (!/^\+?\d{8,15}$/.test(tel.replace(/[^\d+]/g, "")))
      e.tel = "Numéro WhatsApp invalide.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    setEnvoi(true);
    try {
      const res = await evenementAPI.inscrire(String(evenement.id), {
        fullname: nom.trim(),
        phone: tel.replace(/[^\d+]/g, ""),
        attendees: Number(nombre),
        reminder: true,
        ...(tarif ? { tier_label: tarif } : {}),
      });

      if (res.wave_launch_url) {
        window.location.href = res.wave_launch_url;

        return;
      }
      setInscrit(true);
    } catch (err) {
      setErreurs({
        general:
          err instanceof Error
            ? err.message
            : "L’inscription n’a pas pu être enregistrée.",
      });
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-ligne bg-white p-6 lg:p-7">
      <span className="font-heading text-xl font-extrabold text-marine">
        Je participe
      </span>

      {fermee ? (
        <p className="m-0 text-[15px] leading-[1.5] text-encre-douce">
          Les inscriptions pour cet événement sont fermées.
        </p>
      ) : inscrit ? (
        <div
          className="flex flex-col gap-2.5 border border-[#BFE0F7] bg-[#EEF6FD] p-[18px]"
          role="status"
        >
          <span className="text-[17px] font-bold text-marine">
            Inscription enregistrée
          </span>
          <span className="text-[15px] leading-[1.5] text-encre-douce">
            Un rappel vous sera envoyé sur WhatsApp la veille de l’événement.
          </span>
          <button
            className="min-h-11 self-start py-1 text-sm font-bold text-rouge underline"
            type="button"
            onClick={() => setInscrit(false)}
          >
            Modifier
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5">
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
            label="Nombre de personnes"
            options={NOMBRES}
            value={nombre}
            onChange={setNombre}
          />
          {evenement.is_paid && (evenement.pricing_tiers?.length ?? 0) > 0 && (
            <ChampChoix
              label="Tarif"
              options={(evenement.pricing_tiers ?? []).map((t) => ({
                id: t.label,
                label: `${t.label} · ${formatMontant(t.amount)} FCFA`,
              }))}
              value={tarif}
              onChange={setTarif}
            />
          )}
          {erreurs.general && (
            <p className="m-0 text-sm text-rouge">{erreurs.general}</p>
          )}
          <Button
            className="h-auto min-h-11 w-full rounded-charte bg-rouge p-4 text-base font-bold text-white hover:bg-rouge-hover"
            isPending={envoi}
            onPress={inscrire}
          >
            {evenement.is_paid ? "Je m’inscris et je paie" : "Je m’inscris"}
          </Button>
        </div>
      )}
    </div>
  );
}
