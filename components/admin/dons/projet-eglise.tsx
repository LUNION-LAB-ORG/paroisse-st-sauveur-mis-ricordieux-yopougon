"use client";

import type {
  IPhase,
  IPhaseStatut,
  IProjetEglise,
} from "@/features/projet-eglise/types/projet-eglise.type";

import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  Carte,
  ChampTexteAdmin,
  ChampZoneAdmin,
  ErreurChargement,
} from "@/components/admin/ui/kit";
import { ZoneDepot } from "@/components/admin/ui/zone-depot";
import {
  useAjouterPhotosChantierMutation,
  useModifierProjetEgliseMutation,
  useProjetEgliseQuery,
  useRetirerPhotoChantierMutation,
} from "@/features/projet-eglise/queries/projet-eglise.query";
import { formatMontant } from "@/lib/charte";
import { cn } from "@/lib/utils";

const PHASES: Record<IPhaseStatut, { label: string; classe: string }> = {
  done: { label: "Terminée", classe: "bg-succes-fond text-succes" },
  in_progress: {
    label: "En cours",
    classe: "bg-attention-fond text-attention",
  },
  upcoming: { label: "À venir", classe: "bg-neutre-fond text-gris" },
};
const CYCLE: IPhaseStatut[] = ["upcoming", "in_progress", "done"];

const enNombre = (v: string) => Number(v.replace(/[^\d]/g, "") || 0);
const saisieMontant = (v: string) =>
  v.replace(/[^\d]/g, "") ? formatMontant(enNombre(v)) : "";

/** Colonne « Projet de la nouvelle église » de l'écran Dons. */
export function ProjetEglise({ peutModifier }: { peutModifier: boolean }) {
  const requete = useProjetEgliseQuery();
  const projet = requete.data?.data;

  return (
    <Carte
      className="self-start"
      corpsClassName="flex flex-col gap-3.5 p-5 md:p-[22px]"
    >
      <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
        Projet de la nouvelle église
      </h2>
      {requete.isLoading && (
        <p className="m-0 text-sm text-gris">Chargement…</p>
      )}
      {requete.isError && (
        <ErreurChargement
          message="Le projet n’a pas pu être chargé."
          onReessayer={() => requete.refetch()}
        />
      )}
      {projet && (
        <FormulaireProjet
          key={JSON.stringify([
            projet.goal_amount,
            projet.adjustment_amount,
            projet.phases,
            projet.presentation,
          ])}
          peutModifier={peutModifier}
          projet={projet}
        />
      )}
    </Carte>
  );
}

function FormulaireProjet({
  projet,
  peutModifier,
}: {
  projet: IProjetEglise;
  peutModifier: boolean;
}) {
  const [objectif, setObjectif] = useState(
    saisieMontant(String(projet.goal_amount ?? "")),
  );
  const [ajustement, setAjustement] = useState(
    projet.adjustment_amount
      ? saisieMontant(String(projet.adjustment_amount))
      : "",
  );
  const [presentation, setPresentation] = useState(projet.presentation ?? "");
  const [phases, setPhases] = useState<IPhase[]>(projet.phases ?? []);
  const [nouvellePhase, setNouvellePhase] = useState("");
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const [modifie, setModifie] = useState(false);
  const { confirmer, fenetre } = useConfirmation();
  const modifier = useModifierProjetEgliseMutation();
  const ajouterPhotos = useAjouterPhotosChantierMutation();
  const retirerPhoto = useRetirerPhotoChantierMutation();

  useEffect(() => {
    if (!modifie) return;
    const avertir = (e: BeforeUnloadEvent) => e.preventDefault();

    window.addEventListener("beforeunload", avertir);

    return () => window.removeEventListener("beforeunload", avertir);
  }, [modifie]);

  const enLigne = Math.max(
    0,
    (projet.collected_amount ?? 0) - (projet.adjustment_amount ?? 0),
  );
  const collecte = enLigne + enNombre(ajustement);
  const but = enNombre(objectif);
  const progression = but
    ? Math.min(100, Math.floor((collecte / but) * 100))
    : 0;

  const changer = (f: () => void) => {
    f();
    setModifie(true);
  };

  const ajouterPhase = () => {
    const nom = nouvellePhase.trim();

    if (!nom) return;
    changer(() => setPhases((p) => [...p, { name: nom, status: "upcoming" }]));
    setNouvellePhase("");
  };

  const enregistrer = () => {
    const e: Record<string, string> = {};

    if (!but) e.objectif = "Indiquez l’objectif de la collecte.";
    if (phases.some((p) => !p.name.trim()))
      e.phases = "Chaque phase doit avoir un nom.";
    setErreurs(e);
    if (Object.keys(e).length) return;
    modifier.mutate(
      {
        goal_amount: but,
        adjustment_amount: enNombre(ajustement),
        presentation: presentation.trim() || null,
        phases,
      },
      { onSuccess: () => setModifie(false) },
    );
  };

  const supprimerPhoto = async (i: number) => {
    if (
      await confirmer({
        titre: "Retirer cette photo ?",
        message:
          "Elle ne sera plus affichée dans la galerie du chantier sur le site.",
        libelleConfirmer: "Retirer la photo",
        danger: true,
      })
    )
      retirerPhoto.mutate(i);
  };

  const inactif = !peutModifier;

  return (
    <>
      {fenetre}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChampTexteAdmin
          erreur={erreurs.objectif}
          isDisabled={inactif}
          label="Objectif (FCFA)"
          placeholder="Ex. 500 000 000"
          value={objectif}
          onChange={(v) => changer(() => setObjectif(saisieMontant(v)))}
        />
        <ChampTexteAdmin
          isDisabled={inactif}
          label="Dons hors ligne (FCFA)"
          placeholder="Ajustement manuel"
          value={ajustement}
          onChange={(v) => changer(() => setAjustement(saisieMontant(v)))}
        />
      </div>
      <div className="flex flex-col gap-2 rounded-admin bg-selection-admin p-3.5">
        <div className="flex justify-between gap-3 text-sm">
          <span>Montant affiché sur le site</span>
          <strong className="text-marine">{progression} %</strong>
        </div>
        <div
          aria-label="Progression de la collecte"
          aria-valuemax={100}
          aria-valuemin={0}
          aria-valuenow={progression}
          className="h-1.5 rounded-[3px] bg-[#D5DBF0]"
          role="progressbar"
        >
          <div
            className="h-full rounded-[3px] bg-marine transition-[width]"
            style={{ width: `${progression}%` }}
          />
        </div>
        <span className="text-xs text-gris">
          {formatMontant(collecte)} FCFA = dons en ligne payés + dons hors ligne
        </span>
      </div>
      <ChampZoneAdmin
        isDisabled={inactif}
        label="Présentation du projet"
        placeholder="Pourquoi une nouvelle église, capacité, architecture, calendrier."
        rows={3}
        value={presentation}
        onChange={(v) => changer(() => setPresentation(v))}
      />
      <span className="text-sm font-bold">Phases du chantier</span>
      {phases.length === 0 && (
        <span className="text-[13px] text-gris">
          Aucune phase pour l’instant.
        </span>
      )}
      <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
        {phases.map((p, i) => {
          const s = PHASES[p.status] ?? PHASES.upcoming;

          return (
            <li
              key={i}
              className="grid grid-cols-[minmax(0,1fr)_120px_auto] items-center gap-2.5 sm:grid-cols-[minmax(0,1fr)_150px_auto]"
            >
              <span className="text-sm">
                {i + 1}. {p.name}
              </span>
              <button
                aria-label={`${p.name} : ${s.label}. Changer l’état`}
                className={cn(
                  "min-h-9 rounded-admin border-0 p-2 text-[13px] font-bold disabled:cursor-not-allowed",
                  s.classe,
                )}
                disabled={inactif}
                type="button"
                onClick={() =>
                  changer(() =>
                    setPhases((l) =>
                      l.map((x, j) =>
                        j === i
                          ? {
                              ...x,
                              status: CYCLE[(CYCLE.indexOf(x.status) + 1) % 3],
                            }
                          : x,
                      ),
                    ),
                  )
                }
              >
                {s.label}
              </button>
              {!inactif && (
                <button
                  aria-label={`Supprimer la phase ${p.name}`}
                  className="rounded p-1 text-gris hover:text-rouge"
                  type="button"
                  onClick={() =>
                    changer(() => setPhases((l) => l.filter((_, j) => j !== i)))
                  }
                >
                  <X className="size-4" />
                </button>
              )}
            </li>
          );
        })}
      </ol>
      {erreurs.phases && (
        <span className="text-[13px] text-rouge">{erreurs.phases}</span>
      )}
      {!inactif && (
        <div className="flex gap-2">
          <input
            aria-label="Nom de la nouvelle phase"
            className="min-h-10 min-w-0 flex-1 rounded-admin border border-champ bg-white px-3 text-sm"
            placeholder="Nouvelle phase"
            value={nouvellePhase}
            onChange={(e) => setNouvellePhase(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), ajouterPhase())
            }
          />
          <BoutonAdmin
            aria-label="Ajouter la phase"
            className="min-h-10 py-2"
            isDisabled={!nouvellePhase.trim()}
            variante="neutre"
            onPress={ajouterPhase}
          >
            <Plus aria-hidden className="size-4" /> Ajouter
          </BoutonAdmin>
        </div>
      )}
      {projet.gallery?.length > 0 && (
        <ul className="m-0 grid list-none grid-cols-3 gap-2 p-0">
          {projet.gallery.map((src, i) => (
            <li
              key={src}
              className="relative aspect-[4/3] overflow-hidden rounded-admin bg-lin"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Chantier de la nouvelle église, vue ${i + 1}`}
                className="size-full object-cover"
                src={src}
              />
              {!inactif && (
                <button
                  aria-label={`Retirer la photo ${i + 1}`}
                  className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-rouge shadow"
                  disabled={retirerPhoto.isPending}
                  type="button"
                  onClick={() => supprimerPhoto(i)}
                >
                  <X className="size-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!inactif && (
        <ZoneDepot
          multiple
          aide="Affichées dans la galerie du site · JPG, PNG ou WebP, 5 Mo max."
          enCours={ajouterPhotos.isPending}
          libelle="Ajouter des photos du chantier"
          onFichiers={(f) => ajouterPhotos.mutate(f)}
        />
      )}
      {!inactif && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-bord-admin pt-3.5">
          <span
            className={cn(
              "text-[13px]",
              modifie ? "text-attention" : "text-gris",
            )}
          >
            {modifie ? "Modifications non enregistrées" : "Projet à jour"}
          </span>
          <BoutonAdmin
            isDisabled={!modifie}
            isPending={modifier.isPending}
            variante="marine"
            onPress={enregistrer}
          >
            Enregistrer le projet
          </BoutonAdmin>
        </div>
      )}
    </>
  );
}
