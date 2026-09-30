"use client";

import { toast } from "@heroui/react";
import { useState } from "react";

import { type IPropsOnglet, lireSections, SECTIONS_ACCUEIL } from "./types";

import {
  CaseAdmin,
  ChampTexteAdmin,
  ChampZoneAdmin,
  TitreSection,
} from "@/components/admin/ui/kit";
import { ListeReordonnable } from "@/components/admin/ui/liste-reordonnable";
import { ZoneDepot } from "@/components/admin/ui/zone-depot";
import { settingAPI } from "@/features/setting/apis/setting.api";
import { lienSur } from "@/features/setting/utils/hero";

/** Onglet « Page d'accueil » : bannière (image, textes, boutons et liens), sections affichées et leur ordre. */
export function OngletAccueil({
  valeurs,
  changer,
  peutModifier,
  recharger,
}: IPropsOnglet) {
  const [envoi, setEnvoi] = useState(false);
  const sections = lireSections(valeurs["home.sections"]);
  const libelle = (k: string) =>
    SECTIONS_ACCUEIL.find((s) => s.key === k)?.label ?? k;
  const enregistrerSections = (liste: typeof sections) =>
    changer("home.sections", JSON.stringify(liste));

  const erreurLien = (cle: string) => {
    const lien = (valeurs[cle] ?? "").trim();

    return lien && lienSur(lien, "") !== lien
      ? "Indiquez une page du site (/…) ou une adresse https://…"
      : undefined;
  };

  const changerImage = async (fichiers: File[]) => {
    setEnvoi(true);
    try {
      await settingAPI.uploadImage("images.church_render", fichiers[0]);
      toast.success("Image de la bannière remplacée.");
      recharger();
    } catch (e) {
      toast.danger(
        e instanceof Error ? e.message : "L’image n’a pas pu être envoyée.",
      );
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-7 rounded-admin border border-bord-admin bg-white p-6 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="flex flex-col gap-3.5">
        <TitreSection>Bannière d’accueil</TitreSection>
        <div className="grid grid-cols-1 items-center gap-3.5 sm:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex h-[124px] items-center justify-center overflow-hidden rounded-admin bg-marine text-[13px] text-brume">
            {valeurs["images.church_render"] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt="Vue de la future église"
                className="size-full object-cover"
                src={valeurs["images.church_render"]}
              />
            ) : (
              "[Vue de la future église]"
            )}
          </div>
          {peutModifier && (
            <ZoneDepot
              aide="JPG ou PNG, 1600 px de large conseillé"
              enCours={envoi}
              libelle="Changer l’image"
              maxMo={8}
              onFichiers={changerImage}
            />
          )}
        </div>
        <p className="m-0 text-[13px] text-gris">
          Laissez un champ vide pour reprendre le texte par défaut. Liens : une
          page du site (ex. /horaires) ou une adresse https://…
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ChampTexteAdmin
            isDisabled={!peutModifier}
            label="Sur-titre"
            maxLength={80}
            placeholder="Le Sanctuaire de la Miséricorde"
            value={valeurs["hero.eyebrow"] ?? ""}
            onChange={(v) => changer("hero.eyebrow", v)}
          />
          <ChampTexteAdmin
            isDisabled={!peutModifier}
            label="Titre"
            maxLength={90}
            placeholder="Paroisse Saint Sauveur Miséricordieux"
            value={valeurs["hero.title"] ?? ""}
            onChange={(v) => changer("hero.title", v)}
          />
        </div>
        <ChampZoneAdmin
          compteur
          isDisabled={!peutModifier}
          label="Phrase d’accueil"
          maxLength={220}
          placeholder="Une communauté vivante et accueillante à Yopougon Millionnaire."
          rows={2}
          value={valeurs["hero.text"] ?? ""}
          onChange={(v) => changer("hero.text", v)}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ChampTexteAdmin
            isDisabled={!peutModifier}
            label="Bouton principal"
            placeholder="Soutenir la construction"
            value={valeurs["hero.primary_label"] ?? ""}
            onChange={(v) => changer("hero.primary_label", v)}
          />
          <ChampTexteAdmin
            erreur={erreurLien("hero.primary_url")}
            isDisabled={!peutModifier}
            label="Lien du bouton principal"
            placeholder="/nouvelle-eglise"
            value={valeurs["hero.primary_url"] ?? ""}
            onChange={(v) => changer("hero.primary_url", v)}
          />
          <ChampTexteAdmin
            isDisabled={!peutModifier}
            label="Bouton secondaire"
            placeholder="Horaires des messes"
            value={valeurs["hero.secondary_label"] ?? ""}
            onChange={(v) => changer("hero.secondary_label", v)}
          />
          <ChampTexteAdmin
            erreur={erreurLien("hero.secondary_url")}
            isDisabled={!peutModifier}
            label="Lien du bouton secondaire"
            placeholder="/horaires"
            value={valeurs["hero.secondary_url"] ?? ""}
            onChange={(v) => changer("hero.secondary_url", v)}
          />
        </div>
        <ChampTexteAdmin
          isDisabled={!peutModifier}
          label="Légende de l’image"
          maxLength={120}
          placeholder="Vue d’architecte de la future église"
          value={valeurs["hero.image_caption"] ?? ""}
          onChange={(v) => changer("hero.image_caption", v)}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <ChampTexteAdmin
            aide="Vide : aucun lien sous l’image."
            isDisabled={!peutModifier}
            label="Lien sous l’image"
            maxLength={40}
            value={valeurs["hero.link_label"] ?? ""}
            onChange={(v) => changer("hero.link_label", v)}
          />
          <ChampTexteAdmin
            erreur={erreurLien("hero.link_url")}
            isDisabled={!peutModifier}
            label="Destination du lien"
            placeholder="/nouvelle-eglise"
            value={valeurs["hero.link_url"] ?? ""}
            onChange={(v) => changer("hero.link_url", v)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <TitreSection>Sections de l’accueil</TitreSection>
        <span className="text-[13px] text-gris">
          Afficher ou masquer, et réordonner
        </span>
        <div className="rounded-admin border border-bord-admin">
          <ListeReordonnable
            cle={(s) => SECTIONS_ACCUEIL.findIndex((x) => x.key === s.key)}
            elements={sections}
            isDisabled={!peutModifier}
            label="Sections de l’accueil"
            rendu={(s) => (
              <span className="flex items-center justify-between gap-3 text-sm">
                <span className={s.visible ? "" : "text-gris line-through"}>
                  {libelle(s.key)}
                </span>
                <span>
                  <CaseAdmin
                    isDisabled={!peutModifier}
                    valeur={s.visible}
                    onChange={(v) =>
                      enregistrerSections(
                        sections.map((x) =>
                          x.key === s.key ? { ...x, visible: v } : x,
                        ),
                      )
                    }
                  >
                    <span className="sr-only">
                      Afficher « {libelle(s.key)} »
                    </span>
                  </CaseAdmin>
                </span>
              </span>
            )}
            onReordonner={enregistrerSections}
          />
        </div>
      </div>
    </section>
  );
}
