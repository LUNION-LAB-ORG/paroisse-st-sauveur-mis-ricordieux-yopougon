"use client";

import type { IDisponibilites } from "@/features/demande-messe/types/demande-messe.type";

import { ChampChoixAdmin } from "@/components/admin/ui/kit";
import { dateSansAnnee } from "@/lib/charte";
import { cn } from "@/lib/utils";

const ETAT: Record<string, string> = {
  available: "",
  almost_full: "Presque complet",
  full: "Complet",
  too_late: "Délai en ligne dépassé",
};

/**
 * Choix d'une date puis d'une messe célébrée ce jour-là, d'après
 * `GET /mass-requests/availability`. Au secrétariat, le délai minimal ne
 * s'applique pas : seules les messes complètes sont indisponibles.
 */
export function ChoixCreneau({
  dispo,
  chargement,
  erreurChargement,
  date,
  creneau,
  onChange,
  erreur,
}: {
  dispo?: IDisponibilites;
  chargement?: boolean;
  erreurChargement?: boolean;
  date: string;
  creneau: number | null;
  onChange: (date: string, creneau: number | null) => void;
  erreur?: string;
}) {
  if (chargement)
    return <p className="m-0 text-sm text-gris">Chargement des messes…</p>;
  if (erreurChargement || !dispo)
    return (
      <p className="m-0 text-sm text-rouge" role="alert">
        Impossible de charger les messes célébrées. Vérifiez les horaires puis
        réessayez.
      </p>
    );
  const jours = dispo.days.filter((j) => j.slots.length > 0);
  const jour = jours.find((j) => j.date === date);

  if (!jours.length)
    return (
      <p className="m-0 text-sm text-gris">
        Aucune messe programmée sur les 31 prochains jours (voir l’écran
        Horaires).
      </p>
    );

  return (
    <div className="flex flex-col gap-3">
      <ChampChoixAdmin
        erreur={!date ? erreur : undefined}
        label="Date de la messe"
        options={jours.map((j) => ({
          valeur: j.date,
          label: dateSansAnnee(j.date),
        }))}
        placeholder="Choisir une date"
        value={date}
        onChange={(d) => onChange(d, null)}
      />
      {jour && (
        <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
          <legend className="mb-1.5 text-sm font-bold text-encre">Messe</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {jour.slots.map((s) => {
              const complet = s.status === "full";
              const choisi = creneau === s.time_slot_id;

              return (
                <button
                  key={s.time_slot_id}
                  aria-pressed={choisi}
                  className={cn(
                    "flex min-h-11 flex-col items-start rounded-admin border px-3 py-2 text-left text-sm",
                    choisi
                      ? "border-marine bg-selection-admin"
                      : "border-champ bg-white hover:border-marine",
                    complet && "cursor-not-allowed opacity-50",
                  )}
                  disabled={complet}
                  type="button"
                  onClick={() => onChange(jour.date, s.time_slot_id)}
                >
                  <span className="font-bold text-marine">
                    {s.time} · {s.label}
                  </span>
                  <span className="text-xs text-gris">
                    {s.capacity
                      ? `${s.taken} / ${s.capacity} intention(s)`
                      : `${s.taken} intention(s)`}
                    {ETAT[s.status] ? ` · ${ETAT[s.status]}` : ""}
                  </span>
                </button>
              );
            })}
          </div>
          {erreur && date && !creneau && (
            <span className="text-[13px] text-rouge">{erreur}</span>
          )}
        </fieldset>
      )}
    </div>
  );
}
