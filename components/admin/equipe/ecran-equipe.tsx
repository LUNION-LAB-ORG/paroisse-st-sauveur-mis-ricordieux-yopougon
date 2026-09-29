"use client";

import type { IPretre } from "@/features/pretre/types/pretre.type";

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
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  erreursChamps,
  messageErreur,
} from "@/features/admin/utils/reponse-api";
import {
  useEnregistrerPretreMutation,
  usePretresAdminQuery,
  useReordonnerPretresMutation,
  useStatutPretreMutation,
  useSupprimerPretreMutation,
} from "@/features/pretre/queries/pretre-admin.query";
import { cn } from "@/lib/utils";

const FONCTIONS = [
  "Curé",
  "Premier vicaire",
  "Vicaire",
  "Père résident",
  "Diacre",
  "Prêtre en service",
];

type IFormulaire = {
  function: string;
  fullname: string;
  missions: string;
  ordination_year: string;
  since_year: string;
  congregation: string;
  biography: string;
  status: IPretre["status"];
};

const depuis = (p?: IPretre | null): IFormulaire => ({
  function: p?.function ?? "Vicaire",
  fullname: p?.fullname ?? "",
  missions: p?.missions ?? "",
  ordination_year: p?.ordination_year ? String(p.ordination_year) : "",
  since_year: p?.since_year ? String(p.since_year) : "",
  congregation: p?.congregation ?? "",
  biography: p?.biography ?? "",
  status: p?.status ?? "draft",
});

export function EcranEquipe() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("equipe");
  const requete = usePretresAdminQuery();
  const reordonner = useReordonnerPretresMutation();
  const { confirmer, fenetre } = useConfirmation();
  const [choisi, setChoisi] = useState<number | "nouveau" | null>(null);
  const [modifie, setModifie] = useState(false);
  const liste = requete.data ?? [];
  const enCreation = choisi === "nouveau";
  const fiche = enCreation
    ? null
    : (liste.find((p) => p.id === choisi) ?? liste[0] ?? null);

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

  const deplacer = (id: number, sens: -1 | 1) => {
    const i = liste.findIndex((p) => p.id === id);
    const j = i + sens;

    if (i < 0 || j < 0 || j >= liste.length) return;
    const ordre = [...liste];

    [ordre[i], ordre[j]] = [ordre[j], ordre[i]];
    setChoisi(id);
    reordonner.mutate(ordre);
  };

  return (
    <>
      {fenetre}
      <EnTeteAdmin
        actions={
          peutModifier && (
            <BoutonAdmin variante="primaire" onPress={() => changer("nouveau")}>
              + Ajouter un prêtre
            </BoutonAdmin>
          )
        }
        sousTitre="L’ordre des cartes est celui de l’accueil et de la page Équipe pastorale"
        titre="Équipe presbytérale"
      />
      <ContenuAdmin>
        {!peutModifier && <LectureSeule />}
        {requete.isError ? (
          <ErreurChargement
            message="L’équipe n’a pas pu être chargée."
            onReessayer={() => requete.refetch()}
          />
        ) : requete.isLoading ? (
          <EtatVide>Chargement…</EtatVide>
        ) : (
          <>
            {liste.length === 0 && !enCreation ? (
              <Carte>
                <EtatVide>
                  Aucun prêtre pour l’instant. Ajoutez le curé et les vicaires
                  pour les afficher sur le site.
                </EtatVide>
              </Carte>
            ) : (
              <ul className="m-0 grid list-none grid-cols-2 gap-3.5 p-0 md:grid-cols-3 xl:grid-cols-5">
                {liste.map((p, i) => {
                  const actif = !enCreation && p.id === fiche?.id;
                  const visible = p.status === "published";

                  return (
                    <li key={p.id}>
                      <button
                        aria-current={actif || undefined}
                        className={cn(
                          "flex w-full flex-col overflow-hidden rounded-admin bg-white text-left",
                          actif
                            ? "border-2 border-marine"
                            : "border border-bord-admin hover:border-champ",
                          !visible && "opacity-60",
                        )}
                        type="button"
                        onClick={() => changer(p.id)}
                      >
                        <span className="flex h-[150px] w-full items-center justify-center bg-lin text-[13px] text-gris-clair">
                          {p.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              alt=""
                              className="size-full object-cover object-top"
                              src={p.photo}
                            />
                          ) : (
                            "Portrait à ajouter"
                          )}
                        </span>
                        <span className="flex flex-col gap-1 px-3.5 py-3">
                          <span className="text-xs font-bold text-rouge">
                            {p.function}
                          </span>
                          <span className="text-[15px] font-bold text-encre">
                            {p.fullname}
                          </span>
                          <span className="text-xs text-gris">
                            Position {i + 1} ·{" "}
                            {visible
                              ? "visible"
                              : p.status === "draft"
                                ? "brouillon"
                                : "masqué"}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
                {enCreation && (
                  <li>
                    <div className="flex w-full flex-col overflow-hidden rounded-admin border-2 border-marine bg-white opacity-60">
                      <span className="flex h-[150px] items-center justify-center bg-lin text-[13px] text-gris-clair">
                        Nouveau prêtre
                      </span>
                      <span className="px-3.5 py-3 text-xs text-gris">
                        Non enregistré
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            )}
            {(fiche || enCreation) && (
              <FichePretre
                key={enCreation ? "nouveau" : fiche!.id}
                index={fiche ? liste.findIndex((p) => p.id === fiche.id) : -1}
                nombre={liste.length}
                ordreEnCours={reordonner.isPending}
                peutModifier={peutModifier}
                pretre={fiche}
                onCree={(id) => {
                  setModifie(false);
                  setChoisi(id);
                }}
                onDeplacer={(s) => fiche && deplacer(fiche.id, s)}
                onModifie={setModifie}
                onSupprime={() => {
                  setModifie(false);
                  setChoisi(null);
                }}
              />
            )}
          </>
        )}
      </ContenuAdmin>
    </>
  );
}

function FichePretre({
  pretre,
  index,
  nombre,
  peutModifier,
  ordreEnCours,
  onModifie,
  onCree,
  onSupprime,
  onDeplacer,
}: {
  pretre: IPretre | null;
  index: number;
  nombre: number;
  peutModifier: boolean;
  ordreEnCours: boolean;
  onModifie: (m: boolean) => void;
  onCree: (id: number) => void;
  onSupprime: () => void;
  onDeplacer: (sens: -1 | 1) => void;
}) {
  const [f, setF] = useState<IFormulaire>(() => depuis(pretre));
  const [photo, setPhoto] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(pretre?.photo ?? null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [etat, setEtat] = useState<"propre" | "modifie" | "enregistre">(
    "propre",
  );
  const entreePhoto = useRef<HTMLInputElement>(null);
  const enregistrer = useEnregistrerPretreMutation();
  const statut = useStatutPretreMutation();
  const supprimer = useSupprimerPretreMutation();
  const { confirmer, fenetre } = useConfirmation();
  const inactif = !peutModifier;
  const fonctions = FONCTIONS.includes(f.function)
    ? FONCTIONS
    : [...FONCTIONS, f.function];

  useEffect(
    () => () => {
      if (apercu?.startsWith("blob:")) URL.revokeObjectURL(apercu);
    },
    [apercu],
  );

  const maj = <K extends keyof IFormulaire>(k: K, v: IFormulaire[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: "" }));
    setEtat("modifie");
    onModifie(true);
  };

  const annee = (v: string) => v.replace(/\D/g, "").slice(0, 4);

  const valider = () => {
    const e: Record<string, string> = {};
    const max = new Date().getFullYear();

    if (!f.fullname.trim()) e.fullname = "Le nom est obligatoire.";
    if (!f.function.trim()) e.function = "Choisissez la fonction.";
    for (const k of ["ordination_year", "since_year"] as const)
      if (f[k] && (Number(f[k]) < 1900 || Number(f[k]) > max))
        e[k] = `Année entre 1900 et ${max}.`;
    if (f.missions.length > 500) e.missions = "500 caractères maximum.";
    setErreurs(e);

    return !Object.keys(e).length;
  };

  const envoyer = () => {
    if (!valider()) return;
    const fd = new FormData();

    (Object.keys(f) as (keyof IFormulaire)[]).forEach((k) =>
      fd.append(k, f[k].trim()),
    );
    if (!pretre) fd.append("sort_order", String(nombre));
    if (photo) fd.append("photo", photo);
    enregistrer.mutate(
      { id: pretre?.id ?? null, data: fd },
      {
        onSuccess: (r) => {
          setEtat("enregistre");
          setPhoto(null);
          onModifie(false);
          if (!pretre && r?.data?.id) onCree(r.data.id);
        },
        onError: (err) => {
          setErreurs(erreursChamps(err));
          toast.danger(messageErreur(err, "L’enregistrement a échoué."));
        },
      },
    );
  };

  const retirer = async () => {
    if (!pretre) return;
    if (pretre.status !== "hidden") {
      if (
        await confirmer({
          titre: `Retirer ${pretre.fullname} de l’équipe ?`,
          message:
            "Sa carte ne sera plus affichée sur l’accueil ni sur la page Équipe pastorale. La fiche reste conservée ici et peut être republiée.",
          libelleConfirmer: "Retirer de l’équipe",
          danger: true,
        })
      ) {
        statut.mutate({
          id: pretre.id,
          status: "hidden",
          succes: "Retiré de l’équipe affichée",
        });
        setF((p) => ({ ...p, status: "hidden" }));
      }

      return;
    }
    if (
      await confirmer({
        titre: "Supprimer définitivement cette fiche ?",
        message: `La fiche de ${pretre.fullname} (photo, biographie) sera supprimée. Cette action est irréversible.`,
        libelleConfirmer: "Supprimer définitivement",
        danger: true,
      })
    )
      supprimer.mutate(pretre.id, { onSuccess: onSupprime });
  };

  return (
    <Carte corpsClassName="grid grid-cols-1 gap-7 p-5 md:grid-cols-[200px_minmax(0,1fr)] md:px-7 md:py-6">
      {fenetre}
      <div className="flex flex-col gap-2.5">
        <div className="flex h-[240px] items-center justify-center overflow-hidden rounded-admin bg-lin text-[13px] text-gris-clair">
          {apercu ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`Portrait de ${f.fullname || "ce prêtre"}`}
              className="size-full object-cover object-top"
              src={apercu}
            />
          ) : (
            "Aucun portrait"
          )}
        </div>
        {!inactif && (
          <>
            <BoutonAdmin
              className="w-full py-2.5"
              variante="neutre"
              onPress={() => entreePhoto.current?.click()}
            >
              {apercu ? "Changer la photo" : "Ajouter une photo"}
            </BoutonAdmin>
            <input
              ref={entreePhoto}
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              tabIndex={-1}
              type="file"
              onChange={(e) => {
                const fichier = e.target.files?.[0];

                e.target.value = "";
                if (!fichier) return;
                if (fichier.size > 4 * 1024 * 1024) {
                  setErreurs((x) => ({
                    ...x,
                    photo: "La photo dépasse 4 Mo.",
                  }));

                  return;
                }
                setPhoto(fichier);
                setApercu(URL.createObjectURL(fichier));
                setErreurs((x) => ({ ...x, photo: "" }));
                setEtat("modifie");
                onModifie(true);
              }}
            />
            <span className="text-xs text-gris">
              JPG, PNG ou WebP, 4 Mo max.
            </span>
            {erreurs.photo && (
              <span className="text-[13px] text-rouge">{erreurs.photo}</span>
            )}
          </>
        )}
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 sm:grid-cols-2">
        <ChampChoixAdmin
          erreur={erreurs.function}
          isDisabled={inactif}
          label="Fonction"
          options={fonctions.map((x) => ({ valeur: x, label: x }))}
          value={f.function}
          onChange={(v) => maj("function", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.fullname}
          isDisabled={inactif}
          label="Nom"
          placeholder="Père Prénom NOM"
          value={f.fullname}
          onChange={(v) => maj("fullname", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.missions}
          isDisabled={inactif}
          label="Missions confiées"
          maxLength={500}
          value={f.missions}
          onChange={(v) => maj("missions", v)}
        />
        <ChampTexteAdmin
          erreur={erreurs.ordination_year}
          isDisabled={inactif}
          label="Année d’ordination"
          placeholder="Ex. 2008"
          value={f.ordination_year}
          onChange={(v) => maj("ordination_year", annee(v))}
        />
        <ChampTexteAdmin
          erreur={erreurs.since_year}
          isDisabled={inactif}
          label="En poste depuis"
          placeholder="Ex. 2021"
          value={f.since_year}
          onChange={(v) => maj("since_year", annee(v))}
        />
        <ChampTexteAdmin
          isDisabled={inactif}
          label="Congrégation / diocèse"
          value={f.congregation}
          onChange={(v) => maj("congregation", v)}
        />
        <ChampZoneAdmin
          className="sm:col-span-2"
          isDisabled={inactif}
          label="Biographie"
          rows={4}
          value={f.biography}
          onChange={(v) => maj("biography", v)}
        />
        <div className="flex flex-col gap-3 border-t border-bord-admin pt-4 sm:col-span-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <CaseAdmin
              isDisabled={inactif}
              valeur={f.status === "published"}
              onChange={(v) =>
                maj(
                  "status",
                  v
                    ? "published"
                    : pretre?.status === "draft" || !pretre
                      ? "draft"
                      : "hidden",
                )
              }
            >
              Visible sur le site
            </CaseAdmin>
            {!inactif && pretre && (
              <>
                <BoutonAdmin
                  className="min-h-9 px-3 py-[9px] text-[13px]"
                  isDisabled={index <= 0 || ordreEnCours}
                  variante="neutre"
                  onPress={() => onDeplacer(-1)}
                >
                  Monter
                </BoutonAdmin>
                <BoutonAdmin
                  className="min-h-9 px-3 py-[9px] text-[13px]"
                  isDisabled={index >= nombre - 1 || ordreEnCours}
                  variante="neutre"
                  onPress={() => onDeplacer(1)}
                >
                  Descendre
                </BoutonAdmin>
              </>
            )}
          </div>
          {!inactif && (
            <div className="flex flex-wrap gap-2.5">
              {pretre && (
                <BoutonAdmin
                  className="border-[#E8C4CB]"
                  isPending={statut.isPending || supprimer.isPending}
                  variante="danger"
                  onPress={retirer}
                >
                  {pretre.status === "hidden"
                    ? "Supprimer définitivement"
                    : "Retirer de l’équipe"}
                </BoutonAdmin>
              )}
              <BoutonAdmin
                className="px-[22px]"
                isPending={enregistrer.isPending}
                variante="marine"
                onPress={envoyer}
              >
                Enregistrer
              </BoutonAdmin>
            </div>
          )}
        </div>
        <div className="sm:col-span-2">
          <EtatEnregistrement etat={etat} />
        </div>
      </div>
    </Carte>
  );
}
