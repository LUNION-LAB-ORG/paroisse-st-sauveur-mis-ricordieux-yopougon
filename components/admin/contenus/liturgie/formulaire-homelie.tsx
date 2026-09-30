"use client";

import type { IEtatJour } from "./ecran-liturgie";
import type { IPretre } from "@/features/pretre/types/pretre.type";
import type { IHomelieAdmin } from "@/features/liturgie/types/liturgie-admin.type";

import { useState } from "react";

import { ETATS_HOMELIE } from "./ecran-liturgie";

import { ChampZoneRiche } from "@/components/admin/contenus/champ-zone";
import {
  CaseNative,
  ChoixCompact,
} from "@/components/admin/contenus/champs-compacts";
import {
  depuisDateHeureLocale,
  jourLong,
  versDateHeureLocale,
} from "@/components/admin/contenus/dates";
import { DepotCompact } from "@/components/admin/contenus/depot-compact";
import { erreursChamps } from "@/components/admin/contenus/erreur-api";
import {
  BoutonAdmin,
  ChampTexteAdmin,
  Pastille,
} from "@/components/admin/ui/kit";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  useEnregistrerHomelieMutation,
  useSupprimerHomelieMutation,
} from "@/features/liturgie/queries/liturgie-admin.mutation";

type IErreurs = Partial<
  Record<"title" | "content" | "publish_at" | "priest_id", string>
>;

export function FormulaireHomelie({
  date,
  homelie,
  etat,
  pretres,
  pretresEnErreur,
  peutEcrire,
}: {
  date: string;
  homelie?: IHomelieAdmin;
  etat: IEtatJour;
  pretres: IPretre[];
  pretresEnErreur: boolean;
  peutEcrire: boolean;
}) {
  const [pretre, setPretre] = useState(
    homelie?.priest?.id ? String(homelie.priest.id) : "",
  );
  const [titre, setTitre] = useState(homelie?.title ?? "");
  const [texte, setTexte] = useState(homelie?.content ?? "");
  const [publierLe, setPublierLe] = useState(
    versDateHeureLocale(homelie?.publish_at) || `${date}T05:00`,
  );
  const [whatsapp, setWhatsapp] = useState(homelie?.notify_whatsapp ?? false);
  const [audio, setAudio] = useState<File | null>(null);
  const [erreurs, setErreurs] = useState<IErreurs>({});

  const enregistrer = useEnregistrerHomelieMutation();
  const supprimer = useSupprimerHomelieMutation();
  const { confirmer, fenetre } = useConfirmation();
  const e = ETATS_HOMELIE[etat];

  const pretreParDefaut =
    pretres.find((p) => /curé/i.test(p.function)) ?? pretres[0];
  const pretreChoisi =
    pretre || (homelie ? "" : String(pretreParDefaut?.id ?? ""));

  const futur =
    !!publierLe && new Date(`${publierLe}:00Z`).getTime() > Date.now();

  const valider = (): IErreurs => {
    const r: IErreurs = {};

    if (!titre.trim()) r.title = "Indiquez le titre de l’homélie.";
    else if (titre.length > 255) r.title = "255 caractères au maximum.";
    if (!texte.trim()) r.content = "Saisissez le texte de l’homélie.";
    if (publierLe && Number.isNaN(new Date(`${publierLe}:00Z`).getTime()))
      r.publish_at = "Date de publication invalide.";

    return r;
  };

  const soumettre = (statut: "draft" | "published") => {
    const r = valider();

    setErreurs(r);
    if (Object.keys(r).length) return;
    enregistrer.mutate(
      {
        id: homelie?.id,
        audio,
        data: {
          date,
          priest_id: pretreChoisi ? Number(pretreChoisi) : null,
          title: titre.trim(),
          content: texte,
          publish_at: depuisDateHeureLocale(publierLe),
          notify_whatsapp: whatsapp,
          status: statut,
        },
      },
      {
        onSuccess: () => setAudio(null),
        onError: (err) => setErreurs(erreursChamps(err) as IErreurs),
      },
    );
  };

  const enCours = enregistrer.isPending || supprimer.isPending;
  const inactif = !peutEcrire || enCours;

  return (
    <section className="flex flex-col gap-3.5 rounded-admin border border-bord-admin bg-white px-5 py-5 md:px-[26px] md:py-[22px]">
      {fenetre}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="m-0 font-heading text-base font-extrabold text-marine">
          Homélie du {jourLong(date)}
        </h2>
        <Pastille ton={e.ton}>{e.long}</Pastille>
      </div>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <ChoixCompact
          className="[&_label]:text-sm [&_label]:font-bold"
          erreur={
            erreurs.priest_id ??
            (pretresEnErreur
              ? "La liste des prêtres n’a pas pu être chargée."
              : undefined)
          }
          isDisabled={inactif}
          label="Prêtre"
          options={[
            { valeur: "", label: "Non précisé" },
            ...pretres.map((p) => ({
              valeur: String(p.id),
              label: `${p.function} — ${p.fullname}`,
            })),
          ]}
          saisieClassName="min-h-11 px-3 py-[11px] text-[15px]"
          value={pretreChoisi}
          onChange={setPretre}
        />
        <ChampTexteAdmin
          erreur={erreurs.title}
          isDisabled={inactif}
          label="Titre"
          maxLength={255}
          value={titre}
          onChange={setTitre}
        />
      </div>

      <ChampZoneRiche
        serif
        ariaCitation="Citation biblique"
        erreur={erreurs.content}
        isDisabled={inactif}
        label="Texte de l’homélie"
        outils={["gras", "italique", "citation"]}
        rows={8}
        value={texte}
        onChange={setTexte}
      />

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <DepotCompact
            accept="audio/mpeg,audio/mp4,audio/x-m4a,.mp3,.m4a"
            aide="MP3, facultatif"
            choisi={audio ? `${audio.name} — envoyé à l’enregistrement` : null}
            isDisabled={inactif}
            maxMo={20}
            titre={
              homelie?.audio_url
                ? "Remplacer l’enregistrement audio"
                : "Ajouter l’enregistrement audio"
            }
            onFichier={setAudio}
          />
          {homelie?.audio_url && !audio && (
            // eslint-disable-next-line jsx-a11y/media-has-caption -- homélie enregistrée, sans sous-titres disponibles
            <audio
              controls
              aria-label="Enregistrement actuel"
              className="h-9 w-full"
              preload="none"
              src={homelie.audio_url}
            />
          )}
        </div>
        <ChampTexteAdmin
          aide={
            futur
              ? "L’homélie sera visible à cette date."
              : "Laisser dans le passé pour publier immédiatement."
          }
          erreur={erreurs.publish_at}
          isDisabled={inactif}
          label="Publier le"
          type="datetime-local"
          value={publierLe}
          onChange={setPublierLe}
        />
      </div>

      <div className="flex flex-col gap-2.5 border-t border-bord-admin pt-3.5 lg:flex-row lg:items-center lg:justify-end">
        <div className="flex flex-col gap-0.5 lg:mr-auto">
          <CaseNative
            isDisabled={inactif}
            taille={16}
            valeur={whatsapp}
            onChange={setWhatsapp}
          >
            Envoyer aux abonnés WhatsApp à la publication
          </CaseNative>
          <span className="pl-6 text-xs text-gris">
            Envoi effectif dès que WhatsApp Business sera configuré.
          </span>
        </div>
        {peutEcrire && (
          <div className="flex flex-wrap gap-2.5">
            {homelie && (
              <BoutonAdmin
                isDisabled={enCours}
                variante="lien"
                onPress={async () => {
                  if (
                    await confirmer({
                      titre: "Supprimer cette homélie ?",
                      message: `« ${homelie.title} » sera retirée du site. Cette action est définitive.`,
                      libelleConfirmer: "Supprimer",
                      danger: true,
                    })
                  )
                    supprimer.mutate(homelie.id);
                }}
              >
                Supprimer
              </BoutonAdmin>
            )}
            <BoutonAdmin
              isDisabled={enCours}
              isPending={
                enregistrer.isPending &&
                enregistrer.variables?.data.status === "draft"
              }
              variante="neutre"
              onPress={() => soumettre("draft")}
            >
              Enregistrer le brouillon
            </BoutonAdmin>
            <BoutonAdmin
              className="px-5"
              isDisabled={enCours}
              isPending={
                enregistrer.isPending &&
                enregistrer.variables?.data.status === "published"
              }
              variante="marine"
              onPress={() => soumettre("published")}
            >
              {futur ? "Planifier la publication" : "Publier maintenant"}
            </BoutonAdmin>
          </div>
        )}
      </div>
    </section>
  );
}
