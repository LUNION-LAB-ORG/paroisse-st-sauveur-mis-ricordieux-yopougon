"use client";

import type {
  ICreneau,
  ICreneauSaisie,
  ITypeCreneau,
} from "@/features/horaire/types/horaire-admin.type";

import { toast } from "@heroui/react";
import { X } from "lucide-react";
import { useState } from "react";

import { libelleCreneau } from "./libelles";

import {
  CaseNative,
  ChoixCompact,
  SaisieCompacte,
} from "@/components/admin/contenus/champs-compacts";
import { hhmm } from "@/components/admin/contenus/dates";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import { BoutonAdmin } from "@/components/admin/ui/kit";
import {
  useEnregistrerJourMutation,
  useSupprimerCreneauMutation,
} from "@/features/horaire/queries/horaire-admin.mutation";
import { TYPES_CRENEAU } from "@/features/horaire/types/horaire-admin.type";

interface IBrouillon {
  cle: string;
  id?: number;
  heure: string;
  fin: string;
  libelle: string;
  lieu: string;
  capacite: string;
  type: ITypeCreneau;
  actif: boolean;
}

type IErreursLigne = Partial<
  Record<"heure" | "fin" | "capacite" | "libelle", string>
>;

const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;

const depuisCreneau = (c: ICreneau): IBrouillon => ({
  cle: `c${c.id}`,
  id: c.id,
  heure: hhmm(c.start_time),
  fin: hhmm(c.end_time),
  libelle: c.label ?? "",
  lieu: c.location ?? "",
  capacite: c.capacity ? String(c.capacity) : "",
  type: (c.type as ITypeCreneau) ?? "messe",
  actif: c.is_available,
});

/** « 06:30 » + 60 min → « 07:30 » */
function plusUneHeure(h: string): string {
  if (!HEURE.test(h)) return "";
  const [hh, mm] = h.split(":").map(Number);
  const total = Math.min(hh * 60 + mm + 60, 23 * 60 + 59);

  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function versSaisie(b: IBrouillon, weekday: number): ICreneauSaisie {
  return {
    type: b.type,
    label: b.libelle.trim() || null,
    location: b.lieu.trim() || null,
    weekday,
    start_time: b.heure,
    end_time: b.fin,
    capacity: b.capacite ? Number(b.capacite) : null,
    is_available: b.actif,
  };
}

function valider(b: IBrouillon): IErreursLigne {
  const e: IErreursLigne = {};

  if (!HEURE.test(b.heure)) e.heure = "Heure au format HH:MM.";
  if (!HEURE.test(b.fin)) e.fin = "Heure de fin au format HH:MM.";
  else if (HEURE.test(b.heure) && b.fin <= b.heure)
    e.fin = "La fin doit suivre le début.";
  if (b.capacite && (!/^\d+$/.test(b.capacite) || Number(b.capacite) < 1))
    e.capacite = "Nombre entier ≥ 1.";
  if (b.libelle.length > 150) e.libelle = "150 caractères au maximum.";

  return e;
}

/** Fiche du jour choisi : célébrations modifiables. */
export function FicheJour({
  weekday,
  nomJour,
  creneaux,
  chargement,
  peutEcrire,
}: {
  weekday: number;
  nomJour: string;
  creneaux: ICreneau[];
  chargement: boolean;
  peutEcrire: boolean;
}) {
  const [lignes, setLignes] = useState<IBrouillon[]>(() =>
    creneaux.map(depuisCreneau),
  );
  const [erreurs, setErreurs] = useState<Record<string, IErreursLigne>>({});
  const enregistrer = useEnregistrerJourMutation();
  const supprimer = useSupprimerCreneauMutation();
  const { confirmer, fenetre } = useConfirmation();
  const inactif = !peutEcrire || enregistrer.isPending;

  const maj = (cle: string, champ: Partial<IBrouillon>) =>
    setLignes((ls) =>
      ls.map((l) => {
        if (l.cle !== cle) return l;
        const suivant = { ...l, ...champ };

        if (champ.heure !== undefined && !l.fin)
          suivant.fin = plusUneHeure(champ.heure);

        return suivant;
      }),
    );

  const retirer = async (l: IBrouillon) => {
    if (!l.id) {
      setLignes((ls) => ls.filter((x) => x.cle !== l.cle));

      return;
    }
    if (
      await confirmer({
        titre: "Retirer cette célébration ?",
        message: `${libelleCreneau({ label: l.libelle, type: l.type })} du ${nomJour.toLowerCase()} à ${l.heure} disparaîtra de la semaine type et des créneaux de demande de messe.`,
        libelleConfirmer: "Retirer",
        danger: true,
      })
    )
      supprimer.mutate(l.id);
  };

  const soumettre = () => {
    const toutes: Record<string, IErreursLigne> = {};

    for (const l of lignes) {
      const e = valider(l);

      if (Object.keys(e).length) toutes[l.cle] = e;
    }
    setErreurs(toutes);
    if (Object.keys(toutes).length) return;

    const originaux = new Map(creneaux.map((c) => [c.id, depuisCreneau(c)]));
    const creations = lignes
      .filter((l) => !l.id)
      .map((l) => versSaisie(l, weekday));
    const modifications = lignes
      .filter((l) => {
        if (!l.id) return false;
        const o = originaux.get(l.id);

        return (
          o &&
          JSON.stringify({ ...o, cle: "" }) !==
            JSON.stringify({ ...l, cle: "" })
        );
      })
      .map((l) => ({ id: l.id as number, data: versSaisie(l, weekday) }));

    if (!creations.length && !modifications.length) {
      toast.info("Aucune modification à enregistrer.");

      return;
    }
    enregistrer.mutate({ creations, modifications });
  };

  return (
    <aside className="flex flex-col gap-3 self-start rounded-admin border border-t-4 border-bord-admin border-t-marine bg-white p-5">
      {fenetre}
      <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
        {nomJour}
      </h2>
      {chargement ? (
        <p className="m-0 text-sm text-gris">Chargement…</p>
      ) : (
        <>
          {lignes.length === 0 && (
            <p className="m-0 text-sm text-gris">Aucune célébration ce jour.</p>
          )}
          {lignes.map((l) => {
            const e = erreurs[l.cle] ?? {};

            return (
              <div
                key={l.cle}
                className="grid grid-cols-[90px_minmax(0,1fr)] gap-x-2.5 gap-y-2 rounded-admin border border-bord-admin p-3 text-[13px]"
              >
                <SaisieCompacte
                  erreur={e.heure}
                  isDisabled={inactif}
                  label="Heure"
                  type="time"
                  value={l.heure}
                  onChange={(v) => maj(l.cle, { heure: v })}
                />
                <SaisieCompacte
                  erreur={e.libelle}
                  isDisabled={inactif}
                  label="Célébration"
                  maxLength={150}
                  placeholder={libelleCreneau({ label: "", type: l.type })}
                  value={l.libelle}
                  onChange={(v) => maj(l.cle, { libelle: v })}
                />
                <SaisieCompacte
                  isDisabled={inactif}
                  label="Lieu"
                  maxLength={150}
                  value={l.lieu}
                  onChange={(v) => maj(l.cle, { lieu: v })}
                />
                <SaisieCompacte
                  erreur={e.capacite}
                  isDisabled={inactif}
                  label="Intentions max."
                  min={1}
                  placeholder="Illimité"
                  type="number"
                  value={l.capacite}
                  onChange={(v) => maj(l.cle, { capacite: v })}
                />
                <SaisieCompacte
                  erreur={e.fin}
                  isDisabled={inactif}
                  label="Fin"
                  type="time"
                  value={l.fin}
                  onChange={(v) => maj(l.cle, { fin: v })}
                />
                <ChoixCompact
                  isDisabled={inactif}
                  label="Type"
                  options={TYPES_CRENEAU}
                  value={l.type}
                  onChange={(v) => maj(l.cle, { type: v as ITypeCreneau })}
                />
                <div className="col-span-2 flex items-center justify-between gap-2">
                  <CaseNative
                    className="text-[13px] font-semibold"
                    isDisabled={inactif}
                    taille={16}
                    valeur={l.actif}
                    onChange={(v) => maj(l.cle, { actif: v })}
                  >
                    Célébration active
                  </CaseNative>
                  {peutEcrire && (
                    <button
                      className="inline-flex min-h-9 items-center gap-1 rounded-admin px-2 text-[13px] font-bold text-rouge hover:bg-[#FBEAED] disabled:opacity-50"
                      disabled={inactif || supprimer.isPending}
                      type="button"
                      onClick={() => retirer(l)}
                    >
                      <X aria-hidden className="size-4" />
                      Retirer
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {peutEcrire && (
            <>
              <button
                className="min-h-11 rounded-admin border-[1.5px] border-dashed border-champ bg-white p-[11px] text-sm font-bold text-marine hover:border-marine disabled:opacity-50"
                disabled={inactif}
                type="button"
                onClick={() =>
                  setLignes((ls) => [
                    ...ls,
                    {
                      cle: `n${Date.now()}`,
                      heure: "",
                      fin: "",
                      libelle: "",
                      lieu: "Église",
                      capacite: "",
                      type: "messe",
                      actif: true,
                    },
                  ])
                }
              >
                + Ajouter une célébration
              </button>
              <BoutonAdmin
                className="w-full"
                isPending={enregistrer.isPending}
                variante="marine"
                onPress={soumettre}
              >
                Enregistrer
              </BoutonAdmin>
            </>
          )}
        </>
      )}
    </aside>
  );
}
