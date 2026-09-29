"use client";

import type { IService } from "@/features/service/types/service.type";

import { toast } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import {
  EtatEnregistrement,
  LectureSeule,
} from "@/components/admin/demandes/elements";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  CaseAdmin,
  Carte,
  ChampChoixAdmin,
  ChampTexteAdmin,
  ChampZoneAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  EtatVide,
  Pastille,
  type TonPastille,
} from "@/components/admin/ui/kit";
import { ListeReordonnable } from "@/components/admin/ui/liste-reordonnable";
import { ZoneDepot } from "@/components/admin/ui/zone-depot";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  erreursChamps,
  messageErreur,
} from "@/features/admin/utils/reponse-api";
import {
  useEnregistrerServiceMutation,
  useReordonnerServicesMutation,
  useServicesAdminQuery,
  useSupprimerServiceMutation,
} from "@/features/service/queries/service-admin.query";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Liturgie", "Prière", "Jeunesse", "Charité", "Familles"];

const STATUTS: Record<IService["status"], { label: string; ton: TonPastille }> =
  {
    published: { label: "Publié", ton: "succes" },
    hidden: { label: "Masqué", ton: "neutre" },
    draft: { label: "Brouillon", ton: "attention" },
  };

type IFormulaire = {
  title: string;
  category: string;
  description: string;
  content: string;
  audience: string;
  schedule: string;
  location: string;
  leader: string;
  whatsapp: string;
  status: IService["status"];
};

const depuis = (s?: IService | null): IFormulaire => ({
  title: s?.title ?? "",
  category: s?.category ?? "Liturgie",
  description: s?.description ?? "",
  content: s?.content ?? "",
  audience: s?.audience ?? "",
  schedule: s?.schedule ?? "",
  location: s?.location ?? "",
  leader: s?.leader ?? "",
  whatsapp: s?.whatsapp ?? "",
  status: s?.status ?? "draft",
});

export function EcranMouvements() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("mouvements");
  const responsable = droits.role === "movement_leader";
  const requete = useServicesAdminQuery();
  const reordonner = useReordonnerServicesMutation();
  const { confirmer, fenetre } = useConfirmation();
  const [choisi, setChoisi] = useState<number | "nouveau" | null>(null);
  const [modifie, setModifie] = useState(false);
  const tous = requete.data ?? [];
  const liste = responsable
    ? tous.filter((s) => s.id === Number(droits.serviceId))
    : tous;
  const fiche =
    choisi === "nouveau"
      ? null
      : (liste.find((s) => s.id === choisi) ?? liste[0] ?? null);
  const enCreation = choisi === "nouveau";
  const peutGerer = peutModifier && !responsable;

  const changer = async (cible: number | "nouveau") => {
    if (
      modifie &&
      !(await confirmer({
        titre: "Abandonner les modifications ?",
        message:
          "Les modifications non enregistrées de cette fiche seront perdues.",
        libelleConfirmer: "Abandonner",
        danger: true,
      }))
    )
      return;
    setModifie(false);
    setChoisi(cible);
  };

  return (
    <>
      {fenetre}
      <EnTeteAdmin
        actions={
          peutGerer && (
            <BoutonAdmin variante="primaire" onPress={() => changer("nouveau")}>
              + Ajouter un mouvement
            </BoutonAdmin>
          )
        }
        sousTitre="Chaque fiche alimente la carte et la fiche détaillée du site"
        titre="Mouvements et groupes"
      />
      <ContenuAdmin>
        {!peutModifier && <LectureSeule />}
        {requete.isError ? (
          <ErreurChargement
            message="Les mouvements n’ont pas pu être chargés."
            onReessayer={() => requete.refetch()}
          />
        ) : (
          <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[400px_minmax(0,1fr)]">
            <Carte className="self-start overflow-hidden">
              <div className="border-b border-bord-admin px-[18px] py-3.5 text-[13px] text-gris">
                {peutGerer
                  ? "Glisser pour changer l’ordre d’affichage"
                  : responsable
                    ? "Votre mouvement"
                    : "Ordre d’affichage sur le site"}
              </div>
              {requete.isLoading ? (
                <EtatVide>Chargement…</EtatVide>
              ) : liste.length === 0 ? (
                <EtatVide>
                  {responsable
                    ? "Aucun mouvement n’est rattaché à votre compte."
                    : "Aucun mouvement pour l’instant."}
                </EtatVide>
              ) : (
                <ListeReordonnable
                  cle={(s) => s.id}
                  elements={liste}
                  isDisabled={!peutGerer || reordonner.isPending}
                  label="Mouvements et groupes"
                  rendu={(s) => {
                    const st = STATUTS[s.status] ?? STATUTS.published;

                    return (
                      <span
                        className={cn(
                          "flex items-center gap-3 border-l-[3px] pl-2",
                          s.id === fiche?.id && !enCreation
                            ? "border-rouge"
                            : "border-transparent",
                        )}
                      >
                        <span className="flex min-w-0 grow flex-col gap-0.5">
                          <span className="truncate text-[15px] font-bold text-encre">
                            {s.title}
                          </span>
                          <span className="text-xs text-gris">
                            {s.category || "Sans catégorie"}
                          </span>
                        </span>
                        <Pastille ton={st.ton}>{st.label}</Pastille>
                      </span>
                    );
                  }}
                  selection={enCreation ? null : (fiche?.id ?? null)}
                  onChoisir={(s) => changer(s.id)}
                  onReordonner={(ordre) => reordonner.mutate(ordre)}
                />
              )}
            </Carte>
            {(fiche || enCreation) && (
              <FicheMouvement
                key={enCreation ? "nouveau" : fiche!.id}
                peutModifier={peutModifier}
                peutSupprimer={peutGerer}
                service={fiche}
                onCree={(id) => {
                  setModifie(false);
                  setChoisi(id);
                }}
                onModifie={setModifie}
                onSupprime={() => {
                  setModifie(false);
                  setChoisi(null);
                }}
              />
            )}
          </div>
        )}
      </ContenuAdmin>
    </>
  );
}

function FicheMouvement({
  service,
  peutModifier,
  peutSupprimer,
  onModifie,
  onCree,
  onSupprime,
}: {
  service: IService | null;
  peutModifier: boolean;
  peutSupprimer: boolean;
  onModifie: (m: boolean) => void;
  onCree: (id: number) => void;
  onSupprime: () => void;
}) {
  const [f, setF] = useState<IFormulaire>(() => depuis(service));
  const [photo, setPhoto] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(service?.image ?? null);
  const [erreurs, setErreurs] = useState<
    Partial<Record<keyof IFormulaire, string>>
  >({});
  const [etat, setEtat] = useState<"propre" | "modifie" | "enregistre">(
    "propre",
  );
  const enregistrer = useEnregistrerServiceMutation();
  const supprimer = useSupprimerServiceMutation();
  const { confirmer, fenetre } = useConfirmation();
  const zoneDescription = useRef<HTMLTextAreaElement>(null);
  const inactif = !peutModifier;
  const categories =
    CATEGORIES.includes(f.category) || !f.category
      ? CATEGORIES
      : [...CATEGORIES, f.category];

  useEffect(
    () => () => {
      if (apercu?.startsWith("blob:")) URL.revokeObjectURL(apercu);
    },
    [apercu],
  );

  const maj = <K extends keyof IFormulaire>(k: K, v: IFormulaire[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: undefined }));
    setEtat("modifie");
    onModifie(true);
  };

  const puce = () => {
    const zone = zoneDescription.current;
    const debut = zone?.selectionStart ?? f.content.length;
    const avant = f.content.slice(0, debut);
    const ajout = `${avant && !avant.endsWith("\n") ? "\n" : ""}• `;
    const texte = avant + ajout + f.content.slice(debut);

    maj("content", texte);
    requestAnimationFrame(() => {
      zone?.focus();
      zone?.setSelectionRange(debut + ajout.length, debut + ajout.length);
    });
  };

  const valider = () => {
    const e: Partial<Record<keyof IFormulaire, string>> = {};

    if (!f.title.trim()) e.title = "Le nom est obligatoire.";
    if (!f.description.trim())
      e.description =
        "Le résumé est affiché sur la carte : il est obligatoire.";
    if (f.whatsapp && f.whatsapp.replace(/\D/g, "").length < 8)
      e.whatsapp = "Numéro WhatsApp incomplet.";
    setErreurs(e);

    return !Object.keys(e).length;
  };

  const envoyer = () => {
    if (!valider()) return;
    const fd = new FormData();

    (Object.keys(f) as (keyof IFormulaire)[]).forEach((k) =>
      fd.append(k, f[k].trim()),
    );
    if (photo) fd.append("image", photo);
    enregistrer.mutate(
      { id: service?.id ?? null, data: fd },
      {
        onSuccess: (r) => {
          setEtat("enregistre");
          setPhoto(null);
          onModifie(false);
          if (!service && r?.data?.id) onCree(r.data.id);
        },
        onError: (err) => {
          setErreurs(erreursChamps(err) as typeof erreurs);
          toast.danger(messageErreur(err, "L’enregistrement a échoué."));
        },
      },
    );
  };

  const retirer = async () => {
    if (!service) return;
    if (
      await confirmer({
        titre: `Supprimer « ${service.title} » ?`,
        message:
          "La fiche disparaîtra du site et du back-office. Pour la retirer temporairement, décochez plutôt « Publié sur le site ».",
        libelleConfirmer: "Supprimer",
        danger: true,
      })
    )
      supprimer.mutate(service.id, { onSuccess: onSupprime });
  };

  return (
    <Carte
      className="min-w-0"
      corpsClassName="flex flex-col gap-[18px] p-5 md:px-7 md:py-[26px]"
    >
      {fenetre}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="m-0 min-w-0 break-words font-heading text-lg font-extrabold text-marine">
          {f.title || "Nouveau mouvement"}
        </h2>
        <CaseAdmin
          isDisabled={inactif}
          valeur={f.status === "published"}
          onChange={(v) =>
            maj(
              "status",
              v
                ? "published"
                : service?.status === "draft"
                  ? "draft"
                  : "hidden",
            )
          }
        >
          Publié sur le site
        </CaseAdmin>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <ChampTexteAdmin
          erreur={erreurs.title}
          isDisabled={inactif}
          label="Nom"
          maxLength={255}
          value={f.title}
          onChange={(v) => maj("title", v)}
        />
        <ChampChoixAdmin
          isDisabled={inactif}
          label="Catégorie"
          options={categories.map((c) => ({ valeur: c, label: c }))}
          value={f.category}
          onChange={(v) => maj("category", v)}
        />
        <ChampZoneAdmin
          compteur
          className="md:col-span-2"
          erreur={erreurs.description}
          isDisabled={inactif}
          label={
            <>
              Résumé{" "}
              <span className="font-normal text-gris">
                (affiché sur la carte)
              </span>
            </>
          }
          maxLength={150}
          rows={2}
          value={f.description}
          onChange={(v) => maj("description", v)}
        />
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label
            className="text-sm font-bold text-encre"
            htmlFor="description-detaillee"
          >
            Description détaillée{" "}
            <span className="font-normal text-gris">
              (fiche « En savoir plus »)
            </span>
          </label>
          <div className="rounded-admin border border-champ">
            <div className="flex gap-1 border-b border-bord-admin bg-entete-admin px-2 py-1.5">
              {[
                { l: "G", a: "Gras", c: "font-extrabold" },
                { l: "I", a: "Italique", c: "italic" },
              ].map((b) => (
                <button
                  key={b.a}
                  disabled
                  aria-label={`${b.a} (non pris en charge : le site affiche du texte simple)`}
                  className={cn("size-8 cursor-not-allowed opacity-40", b.c)}
                  title="Le site affiche la description en texte simple"
                  type="button"
                >
                  {b.l}
                </button>
              ))}
              <button
                aria-label="Liste à puces"
                className="size-8 rounded hover:bg-white disabled:opacity-40"
                disabled={inactif}
                title="Ajouter une puce"
                type="button"
                onClick={puce}
              >
                •
              </button>
              <button
                disabled
                aria-label="Lien (non pris en charge : le site affiche du texte simple)"
                className="h-8 cursor-not-allowed px-1 text-[13px] opacity-40"
                title="Le site affiche la description en texte simple"
                type="button"
              >
                Lien
              </button>
            </div>
            <textarea
              ref={zoneDescription}
              className="block w-full resize-y border-0 bg-white p-3 text-[15px] leading-[1.55] text-encre outline-none disabled:opacity-60"
              disabled={inactif}
              id="description-detaillee"
              rows={4}
              value={f.content}
              onChange={(e) => maj("content", e.target.value)}
            />
          </div>
        </div>
        <ChampTexteAdmin
          isDisabled={inactif}
          label="Public concerné"
          placeholder="Ex. Adultes, jeunes de 15 à 30 ans"
          value={f.audience}
          onChange={(v) => maj("audience", v)}
        />
        <ChampTexteAdmin
          isDisabled={inactif}
          label="Jour et heure des rencontres"
          placeholder="Ex. Jeudi, 18:30"
          value={f.schedule}
          onChange={(v) => maj("schedule", v)}
        />
        <ChampTexteAdmin
          isDisabled={inactif}
          label="Responsable"
          value={f.leader}
          onChange={(v) => maj("leader", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.whatsapp}
          isDisabled={inactif}
          label="WhatsApp du responsable"
          placeholder="+225 07 00 00 00 00"
          type="tel"
          value={f.whatsapp}
          onChange={(v) => maj("whatsapp", v)}
        />
        <ChampTexteAdmin
          isDisabled={inactif}
          label="Lieu des rencontres"
          placeholder="Ex. Salle paroissiale"
          value={f.location}
          onChange={(v) => maj("location", v)}
        />
      </div>
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="flex h-[110px] items-center justify-center overflow-hidden rounded-admin bg-lin text-[13px] text-gris-clair">
          {apercu ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`Le groupe ${f.title}`}
              className="size-full object-cover"
              src={apercu}
            />
          ) : (
            "Aucune photo"
          )}
        </div>
        {!inactif && (
          <ZoneDepot
            aide="JPG ou PNG, redimensionnée automatiquement"
            libelle="Glissez une photo ici ou parcourez"
            maxMo={4}
            onFichiers={([fichier]) => {
              setPhoto(fichier);
              setApercu(URL.createObjectURL(fichier));
              setEtat("modifie");
              onModifie(true);
            }}
          />
        )}
      </div>
      <div className="flex flex-col gap-3 border-t border-bord-admin pt-[18px] sm:flex-row sm:items-center sm:justify-between">
        <EtatEnregistrement etat={etat} />
        <div className="flex flex-wrap gap-2.5">
          {peutSupprimer && service && (
            <BoutonAdmin
              isPending={supprimer.isPending}
              variante="danger"
              onPress={retirer}
            >
              Supprimer
            </BoutonAdmin>
          )}
          {service && (
            <BoutonAdmin
              cible="_blank"
              href={`/mouvement/${service.id}`}
              variante="neutre"
            >
              Aperçu sur le site
            </BoutonAdmin>
          )}
          {!inactif && (
            <BoutonAdmin
              className="px-[22px]"
              isPending={enregistrer.isPending}
              variante="marine"
              onPress={envoyer}
            >
              Enregistrer
            </BoutonAdmin>
          )}
        </div>
      </div>
    </Carte>
  );
}
