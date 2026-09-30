"use client";

import type {
  ICreneau,
  IException,
} from "@/features/horaire/types/horaire-admin.type";

import { useState } from "react";

import { libelleCreneau, libelleCreneauHeure } from "./libelles";

import {
  ChoixCompact,
  SaisieCompacte,
} from "@/components/admin/contenus/champs-compacts";
import {
  dateCourte,
  dateDepuisIso,
  hhmm,
  isoJour,
} from "@/components/admin/contenus/dates";
import {
  erreursChamps,
  messageErreur,
} from "@/components/admin/contenus/erreur-api";
import { FenetreAdmin } from "@/components/admin/contenus/mise-en-page";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  ErreurChargement,
  TableauAdmin,
} from "@/components/admin/ui/kit";
import {
  useEnregistrerExceptionMutation,
  useSupprimerExceptionMutation,
} from "@/features/horaire/queries/horaire-admin.mutation";
import { useExceptionsQuery } from "@/features/horaire/queries/horaire-admin.query";

type INature = "suppression" | "ajout";

interface IFormulaire {
  id?: number;
  date: string;
  nature: INature;
  creneau: string;
  heure: string;
  libelle: string;
  lieu: string;
}

const VIDE: IFormulaire = {
  date: "",
  nature: "suppression",
  creneau: "",
  heure: "",
  libelle: "",
  lieu: "",
};

/** Tableau « Exceptions et fêtes » et fenêtre de saisie. */
export function TableExceptions({
  creneaux,
  peutEcrire,
}: {
  creneaux: ICreneau[];
  peutEcrire: boolean;
}) {
  const aujourdhui = isoJour();
  const exceptions = useExceptionsQuery(aujourdhui);
  const enregistrer = useEnregistrerExceptionMutation();
  const supprimer = useSupprimerExceptionMutation();
  const { confirmer, fenetre } = useConfirmation();
  const [form, setForm] = useState<IFormulaire | null>(null);
  const [erreurs, setErreurs] = useState<Record<string, string>>({});

  const creneauParId = new Map(creneaux.map((c) => [c.id, c]));

  const changement = (e: IException) => {
    const c = e.time_slot_id ? creneauParId.get(e.time_slot_id) : undefined;

    if (e.is_cancelled)
      return c
        ? `${libelleCreneau(c)} (${hhmm(c.start_time)}) supprimée`
        : "Célébration supprimée";

    return e.start_time
      ? `Célébration ajoutée à ${hhmm(e.start_time)}`
      : "Célébration ajoutée";
  };

  const ouvrir = (e?: IException) => {
    setErreurs({});
    setForm(
      e
        ? {
            id: e.id,
            date: e.date.slice(0, 10),
            nature: e.is_cancelled ? "suppression" : "ajout",
            creneau: e.time_slot_id ? String(e.time_slot_id) : "",
            heure: hhmm(e.start_time),
            libelle: e.label ?? "",
            lieu: e.location ?? "",
          }
        : { ...VIDE },
    );
  };

  const creneauxDuJour = form?.date
    ? creneaux.filter(
        (c) => Number(c.weekday) === dateDepuisIso(form.date).getUTCDay(),
      )
    : [];

  const soumettre = () => {
    if (!form) return;
    const e: Record<string, string> = {};

    if (!form.date) e.date = "Choisissez la date.";
    if (form.nature === "suppression" && !form.creneau)
      e.time_slot_id = "Choisissez la célébration supprimée.";
    if (form.nature === "ajout") {
      if (!/^\d{2}:\d{2}$/.test(form.heure)) e.start_time = "Indiquez l’heure.";
      if (!form.libelle.trim()) e.label = "Indiquez la célébration.";
    }
    if (form.libelle.length > 150) e.label = "150 caractères au maximum.";
    setErreurs(e);
    if (Object.keys(e).length) return;

    const suppression = form.nature === "suppression";

    enregistrer.mutate(
      {
        id: form.id,
        data: {
          date: form.date,
          is_cancelled: suppression,
          time_slot_id: suppression ? Number(form.creneau) : null,
          start_time: suppression ? null : form.heure,
          label: form.libelle.trim() || null,
          location: suppression ? null : form.lieu.trim() || null,
        },
      },
      {
        onSuccess: () => setForm(null),
        onError: (err) => setErreurs(erreursChamps(err)),
      },
    );
  };

  const retirer = async () => {
    if (!form?.id) return;
    if (
      await confirmer({
        titre: "Supprimer cette exception ?",
        message: "L’horaire habituel s’appliquera de nouveau ce jour-là.",
        libelleConfirmer: "Supprimer",
        danger: true,
      })
    )
      supprimer.mutate(form.id, { onSuccess: () => setForm(null) });
  };

  const maj = (champ: Partial<IFormulaire>) =>
    setForm((f) => (f ? { ...f, ...champ } : f));

  const lignes = [...(exceptions.data ?? [])].sort((a, b) =>
    `${a.date}${a.start_time ?? ""}`.localeCompare(
      `${b.date}${b.start_time ?? ""}`,
    ),
  );

  return (
    <section className="rounded-admin border border-bord-admin bg-white">
      {fenetre}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bord-admin px-5 py-4">
        <h2 className="m-0 font-heading text-base font-extrabold text-marine">
          Exceptions et fêtes
        </h2>
        {peutEcrire && (
          <BoutonAdmin
            className="min-h-9 px-3.5 py-[9px] text-[13px]"
            variante="primaire"
            onPress={() => ouvrir()}
          >
            + Ajouter une exception
          </BoutonAdmin>
        )}
      </div>
      {exceptions.isError ? (
        <div className="p-5">
          <ErreurChargement
            message={`Les exceptions n’ont pas pu être chargées. ${messageErreur(exceptions.error)}`}
            onReessayer={() => exceptions.refetch()}
          />
        </div>
      ) : (
        <TableauAdmin
          chargement={exceptions.isLoading}
          cleLigne={(e) => e.id}
          colonnes={[
            {
              cle: "date",
              titre: "Date",
              className: "font-bold whitespace-nowrap",
              rendu: (e) => dateCourte(e.date),
            },
            { cle: "changement", titre: "Changement", rendu: changement },
            {
              cle: "motif",
              titre: "Motif",
              rendu: (e) => e.label || "—",
            },
            {
              cle: "actions",
              titre: "Actions",
              className: "text-right",
              rendu: (e) =>
                peutEcrire ? (
                  <button
                    className="font-bold text-rouge hover:text-rouge-hover hover:underline"
                    type="button"
                    onClick={() => ouvrir(e)}
                  >
                    Modifier
                  </button>
                ) : null,
            },
          ]}
          lignes={lignes}
          vide="Aucune exception à venir."
        />
      )}

      <FenetreAdmin
        ouverte={!!form}
        pied={
          <>
            {form?.id && (
              <BoutonAdmin
                className="mr-auto"
                isDisabled={enregistrer.isPending}
                isPending={supprimer.isPending}
                variante="danger"
                onPress={retirer}
              >
                Supprimer
              </BoutonAdmin>
            )}
            <BoutonAdmin variante="neutre" onPress={() => setForm(null)}>
              Annuler
            </BoutonAdmin>
            <BoutonAdmin
              isDisabled={supprimer.isPending}
              isPending={enregistrer.isPending}
              variante="marine"
              onPress={soumettre}
            >
              Enregistrer
            </BoutonAdmin>
          </>
        }
        titre={form?.id ? "Modifier l’exception" : "Nouvelle exception"}
        onFermer={() => setForm(null)}
      >
        {form && (
          <>
            <SaisieCompacte
              erreur={erreurs.date}
              label="Date"
              type="date"
              value={form.date}
              onChange={(v) => maj({ date: v, creneau: "" })}
            />
            <fieldset className="m-0 flex flex-col gap-2 border-0 p-0">
              <legend className="mb-1 text-[13px] font-semibold">
                Changement
              </legend>
              {(
                [
                  ["suppression", "Une célébration habituelle est supprimée"],
                  ["ajout", "Une célébration ponctuelle est ajoutée"],
                ] as const
              ).map(([v, l]) => (
                <label
                  key={v}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <input
                    checked={form.nature === v}
                    className="size-4 accent-marine"
                    name="nature"
                    type="radio"
                    onChange={() => maj({ nature: v })}
                  />
                  {l}
                </label>
              ))}
            </fieldset>
            {form.nature === "suppression" ? (
              <>
                <ChoixCompact
                  erreur={erreurs.time_slot_id}
                  isDisabled={!form.date}
                  label="Célébration supprimée"
                  options={[
                    {
                      valeur: "",
                      label: form.date
                        ? creneauxDuJour.length
                          ? "Choisir…"
                          : "Aucune célébration ce jour-là"
                        : "Choisissez d’abord la date",
                    },
                    ...creneauxDuJour.map((c) => ({
                      valeur: String(c.id),
                      label: libelleCreneauHeure(c),
                    })),
                  ]}
                  value={form.creneau}
                  onChange={(v) => maj({ creneau: v })}
                />
                <SaisieCompacte
                  erreur={erreurs.label}
                  label="Motif"
                  maxLength={150}
                  placeholder="Ex. Retraite des prêtres"
                  value={form.libelle}
                  onChange={(v) => maj({ libelle: v })}
                />
              </>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
                <SaisieCompacte
                  erreur={erreurs.start_time}
                  label="Heure"
                  type="time"
                  value={form.heure}
                  onChange={(v) => maj({ heure: v })}
                />
                <SaisieCompacte
                  erreur={erreurs.label}
                  label="Célébration et motif"
                  maxLength={150}
                  placeholder="Ex. Messe unique — fête patronale"
                  value={form.libelle}
                  onChange={(v) => maj({ libelle: v })}
                />
                <SaisieCompacte
                  className="sm:col-span-2"
                  label="Lieu"
                  maxLength={150}
                  value={form.lieu}
                  onChange={(v) => maj({ lieu: v })}
                />
              </div>
            )}
          </>
        )}
      </FenetreAdmin>
    </section>
  );
}
