"use client";

import type { ICure } from "@/features/cure/types/cure.type";

import { toast } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  EtatEnregistrement,
  LectureSeule,
} from "@/components/admin/demandes/elements";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  Carte,
  ChampTexteAdmin,
  ChampZoneAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  EtatVide,
  GrilleListeFiche,
} from "@/components/admin/ui/kit";
import { ZoneDepot } from "@/components/admin/ui/zone-depot";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  erreursChamps,
  messageErreur,
} from "@/features/admin/utils/reponse-api";
import { cureAPI } from "@/features/cure/apis/cure.api";
import { cn } from "@/lib/utils";

const CLE = ["cure", "admin"];

interface IFormulaire {
  fullname: string;
  started_at: string;
  ended_at: string;
  description: string;
}

const jour = (d?: string | null) => (d ? d.slice(0, 10) : "");
const annee = (d?: string | null) => (d ? d.slice(0, 4) : "");
const periode = (c: ICure) =>
  c.ended_at
    ? `${annee(c.started_at)} – ${annee(c.ended_at)}`
    : `Depuis ${annee(c.started_at)}`;

const depuis = (c?: ICure | null): IFormulaire => ({
  fullname: c?.fullname ?? "",
  started_at: jour(c?.started_at),
  ended_at: jour(c?.ended_at),
  description: c?.description ?? "",
});

/** Curés successifs : affichés sur la page publique « Notre histoire ». */
export function EcranCures() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("histoire");
  const requete = useQuery({
    queryKey: CLE,
    queryFn: () =>
      cureAPI.obtenirTous({
        per_page: 100,
        sort_by: "started_at",
        sort_dir: "asc",
      }),
    select: (r) => r.data ?? [],
  });
  const { confirmer, fenetre } = useConfirmation();
  const [choisi, setChoisi] = useState<number | "nouveau" | null>(null);
  const [modifie, setModifie] = useState(false);
  const liste = requete.data ?? [];
  const enCreation = choisi === "nouveau";
  const fiche = enCreation
    ? null
    : (liste.find((c) => c.id === choisi) ?? liste[liste.length - 1] ?? null);

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
          peutModifier && (
            <BoutonAdmin variante="primaire" onPress={() => changer("nouveau")}>
              + Ajouter un curé
            </BoutonAdmin>
          )
        }
        sousTitre="Affichés du plus ancien au plus récent sur la page Notre histoire"
        titre="Curés successifs"
      />
      <ContenuAdmin>
        {!peutModifier && <LectureSeule />}
        {requete.isError ? (
          <ErreurChargement
            message="La liste des curés n’a pas pu être chargée."
            onReessayer={() => requete.refetch()}
          />
        ) : requete.isLoading ? (
          <EtatVide>Chargement…</EtatVide>
        ) : (
          <GrilleListeFiche
            fiche={
              fiche || enCreation ? (
                <FicheCure
                  key={enCreation ? "nouveau" : fiche!.id}
                  cure={fiche}
                  peutModifier={peutModifier}
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
              ) : (
                <span />
              )
            }
            largeurFiche={420}
            liste={
              <Carte titre={`Chronologie (${liste.length})`}>
                {liste.length === 0 && !enCreation ? (
                  <EtatVide>
                    Aucun curé pour l’instant. Ajoutez les curés successifs de
                    la paroisse, du premier à l’actuel.
                  </EtatVide>
                ) : (
                  <ol className="m-0 flex list-none flex-col p-0">
                    {liste.map((c) => {
                      const actif = !enCreation && c.id === fiche?.id;

                      return (
                        <li key={c.id}>
                          <button
                            aria-current={actif || undefined}
                            className={cn(
                              "grid w-full grid-cols-[48px_minmax(0,1fr)] items-center gap-3.5 border-b border-bord-admin px-5 py-3 text-left md:px-[22px]",
                              actif
                                ? "bg-info-fond shadow-[inset_3px_0_0_var(--color-marine)]"
                                : "hover:bg-entete-admin",
                            )}
                            type="button"
                            onClick={() => changer(c.id)}
                          >
                            <span className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-lin text-sm font-bold text-marine">
                              {c.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  alt=""
                                  className="size-full object-cover object-top"
                                  src={c.photo}
                                />
                              ) : (
                                c.fullname
                                  .replace(/^(Père|Abbé|Mgr)\s+/i, "")
                                  .charAt(0)
                              )}
                            </span>
                            <span className="flex min-w-0 flex-col">
                              <span className="truncate text-[15px] font-bold text-encre">
                                {c.fullname}
                              </span>
                              <span className="text-[13px] text-gris">
                                {periode(c)}
                                {!c.ended_at && " · en fonction"}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                    {enCreation && (
                      <li className="border-b border-bord-admin bg-info-fond px-5 py-3 text-sm text-gris md:px-[22px]">
                        Nouveau curé — non enregistré
                      </li>
                    )}
                  </ol>
                )}
              </Carte>
            }
          />
        )}
      </ContenuAdmin>
    </>
  );
}

function FicheCure({
  cure,
  peutModifier,
  onModifie,
  onCree,
  onSupprime,
}: {
  cure: ICure | null;
  peutModifier: boolean;
  onModifie: (m: boolean) => void;
  onCree: (id: number) => void;
  onSupprime: () => void;
}) {
  const client = useQueryClient();
  const [f, setF] = useState<IFormulaire>(() => depuis(cure));
  const [photo, setPhoto] = useState<File | null>(null);
  const [apercu, setApercu] = useState<string | null>(cure?.photo ?? null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [etat, setEtat] = useState<"propre" | "modifie" | "enregistre">(
    "propre",
  );
  const { confirmer, fenetre } = useConfirmation();
  const inactif = !peutModifier;

  useEffect(
    () => () => {
      if (apercu?.startsWith("blob:")) URL.revokeObjectURL(apercu);
    },
    [apercu],
  );

  const toucher = () => {
    setEtat("modifie");
    onModifie(true);
  };
  const maj = (k: keyof IFormulaire, v: string) => {
    setF((p) => ({ ...p, [k]: v }));
    setErreurs((e) => ({ ...e, [k]: "" }));
    toucher();
  };

  const enregistrer = useMutation({
    mutationFn: (fd: FormData) =>
      cure ? cureAPI.modifier(String(cure.id), fd) : cureAPI.ajouter(fd),
    onSuccess: async (r) => {
      toast.success(cure ? "Fiche enregistrée" : "Curé ajouté");
      setEtat("enregistre");
      setPhoto(null);
      onModifie(false);
      await client.invalidateQueries({ queryKey: ["cure"] });
      if (!cure && r?.id) onCree(r.id);
    },
    onError: (err) => {
      setErreurs(erreursChamps(err));
      toast.danger(messageErreur(err, "L’enregistrement a échoué."));
    },
  });

  const supprimer = useMutation({
    mutationFn: (id: number) => cureAPI.supprimer(String(id)),
    onSuccess: async () => {
      toast.success("Fiche supprimée");
      await client.invalidateQueries({ queryKey: ["cure"] });
      onSupprime();
    },
    onError: (e) => toast.danger(messageErreur(e)),
  });

  const envoyer = () => {
    const e: Record<string, string> = {};

    if (!f.fullname.trim()) e.fullname = "Le nom est obligatoire.";
    if (!f.started_at) e.started_at = "Indiquez la date d’arrivée.";
    if (f.ended_at && f.started_at && f.ended_at < f.started_at)
      e.ended_at = "La fin doit suivre l’arrivée.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    const fd = new FormData();

    fd.append("fullname", f.fullname.trim());
    fd.append("started_at", f.started_at);
    fd.append("ended_at", f.ended_at);
    fd.append("description", f.description.trim());
    if (photo) fd.append("photo", photo);
    if (cure) fd.append("_method", "PUT");
    enregistrer.mutate(fd);
  };

  const retirer = async () => {
    if (
      cure &&
      (await confirmer({
        titre: `Supprimer la fiche de ${cure.fullname} ?`,
        message:
          "Elle ne sera plus affichée sur la page Notre histoire. Cette action est irréversible.",
        libelleConfirmer: "Supprimer",
        danger: true,
      }))
    )
      supprimer.mutate(cure.id);
  };

  return (
    <Carte
      accent
      corpsClassName="flex flex-col gap-4 p-5 md:p-[22px]"
      titre={cure ? cure.fullname : "Nouveau curé"}
    >
      {fenetre}
      <div className="flex items-center gap-4">
        <span className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-lin text-[13px] text-gris-clair">
          {apercu ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`Portrait de ${f.fullname || "ce curé"}`}
              className="size-full object-cover object-top"
              src={apercu}
            />
          ) : (
            "Portrait"
          )}
        </span>
        {!inactif && (
          <ZoneDepot
            aide="JPG, PNG ou WebP, 4 Mo max."
            className="grow"
            libelle={apercu ? "Changer le portrait" : "Ajouter un portrait"}
            maxMo={4}
            onFichiers={(l) => {
              setPhoto(l[0]);
              setApercu(URL.createObjectURL(l[0]));
              toucher();
            }}
          />
        )}
      </div>
      {erreurs.photo && (
        <span className="text-[13px] text-rouge">{erreurs.photo}</span>
      )}
      <ChampTexteAdmin
        erreur={erreurs.fullname}
        isDisabled={inactif}
        label="Nom"
        maxLength={150}
        placeholder="Père Prénom NOM"
        value={f.fullname}
        onChange={(v) => maj("fullname", v)}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ChampTexteAdmin
          erreur={erreurs.started_at}
          isDisabled={inactif}
          label="Arrivée"
          type="date"
          value={f.started_at}
          onChange={(v) => maj("started_at", v)}
        />
        <ChampTexteAdmin
          aide="Vide : curé actuellement en fonction."
          erreur={erreurs.ended_at}
          isDisabled={inactif}
          label="Fin de mission"
          type="date"
          value={f.ended_at}
          onChange={(v) => maj("ended_at", v)}
        />
      </div>
      <ChampZoneAdmin
        compteur
        erreur={erreurs.description}
        isDisabled={inactif}
        label="Quelques mots (facultatif)"
        maxLength={2000}
        rows={5}
        value={f.description}
        onChange={(v) => maj("description", v)}
      />
      {!inactif && (
        <div className="flex flex-col gap-3 border-t border-bord-admin pt-4">
          <div className="flex flex-wrap gap-2.5">
            <BoutonAdmin
              isPending={enregistrer.isPending}
              variante="marine"
              onPress={envoyer}
            >
              {cure ? "Enregistrer" : "Ajouter"}
            </BoutonAdmin>
            {cure && (
              <BoutonAdmin
                className="ml-auto"
                isPending={supprimer.isPending}
                variante="danger"
                onPress={retirer}
              >
                Supprimer
              </BoutonAdmin>
            )}
          </div>
          <EtatEnregistrement etat={etat} />
        </div>
      )}
    </Carte>
  );
}
