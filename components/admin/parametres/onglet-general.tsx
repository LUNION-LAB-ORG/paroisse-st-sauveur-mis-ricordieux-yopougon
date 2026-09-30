"use client";

import type { IPropsOnglet } from "./types";

import { toast } from "@heroui/react";
import { useState } from "react";

import { ChampTexteAdmin } from "@/components/admin/ui/kit";
import { ZoneDepot } from "@/components/admin/ui/zone-depot";
import { settingAPI } from "@/features/setting/apis/setting.api";
import { LOGO_PAR_DEFAUT } from "@/lib/charte";

const CHAMPS: {
  cle: string;
  label: string;
  type?: "text" | "tel" | "email" | "url";
  placeholder?: string;
}[] = [
  { cle: "parish.name", label: "Nom de la paroisse" },
  { cle: "parish.tagline", label: "Devise" },
  { cle: "parish.address", label: "Adresse" },
  { cle: "parish.phone", label: "Téléphone du secrétariat", type: "tel" },
  { cle: "parish.email", label: "E-mail", type: "email" },
  {
    cle: "parish.office_hours",
    label: "Horaires du secrétariat",
    placeholder: "Lundi au samedi, 8 h – 12 h et 15 h – 18 h",
  },
  {
    cle: "social.facebook",
    label: "Page Facebook",
    type: "url",
    placeholder: "https://facebook.com/…",
  },
  {
    cle: "social.youtube",
    label: "Chaîne YouTube",
    type: "url",
    placeholder: "https://youtube.com/@…",
  },
];

/** Onglet « Général » : logo et coordonnées de la paroisse. */
export function OngletGeneral({
  valeurs,
  changer,
  peutModifier,
  recharger,
}: IPropsOnglet) {
  const [envoi, setEnvoi] = useState(false);
  const logo =
    valeurs["images.logo_custom"] === "1" && valeurs["images.logo"]
      ? valeurs["images.logo"]
      : LOGO_PAR_DEFAUT;

  const remplacerLogo = async (fichiers: File[]) => {
    setEnvoi(true);
    try {
      await settingAPI.uploadImage("images.logo", fichiers[0]);
      toast.success("Logo remplacé.");
      recharger();
    } catch (e) {
      toast.danger(
        e instanceof Error ? e.message : "Le logo n’a pas pu être envoyé.",
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-7 rounded-admin border border-bord-admin bg-white p-6 md:grid-cols-[180px_minmax(0,1fr)]">
      <div className="flex flex-col items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Logo actuel"
          className="size-[150px] rounded-full object-cover"
          src={logo}
        />
        {peutModifier && (
          <ZoneDepot
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            aide="PNG ou SVG carré, fond blanc"
            className="w-full"
            enCours={envoi}
            libelle="Remplacer le logo"
            onFichiers={remplacerLogo}
          />
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
        {CHAMPS.map((c) => (
          <ChampTexteAdmin
            key={c.cle}
            isDisabled={!peutModifier}
            label={c.label}
            placeholder={c.placeholder}
            type={c.type}
            value={valeurs[c.cle] ?? ""}
            onChange={(v) => changer(c.cle, v)}
          />
        ))}
      </div>
    </section>
  );
}
