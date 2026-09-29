import { cn } from "@/lib/utils";

const LIBELLES = ["Intention", "Date", "Coordonnées", "Offrande"];

/**
 * Progression par étapes (étape > nombre d'étapes = toutes validées).
 * Par défaut, les 4 étapes de la demande de messe.
 */
export function EtapesDemande({
  etape,
  libelles = LIBELLES,
  label = "Étapes de la demande",
}: {
  etape: number;
  libelles?: readonly string[];
  label?: string;
}) {
  return (
    <ol
      aria-label={label}
      className="m-0 mt-6 grid list-none p-0 lg:mt-[26px]"
      style={{
        gridTemplateColumns: `repeat(${libelles.length}, minmax(0, 1fr))`,
      }}
    >
      {libelles.map((libelle, i) => {
        const n = i + 1;
        const fait = etape > n;
        const courant = etape === n;

        return (
          <li
            key={libelle}
            aria-current={courant ? "step" : undefined}
            className={cn(
              "flex flex-col items-start gap-2 border-b-4 pb-[18px] text-xs sm:flex-row sm:items-center sm:gap-2.5 sm:text-[15px]",
              courant
                ? "border-ciel font-bold text-white"
                : fait
                  ? "border-marine-line text-white"
                  : "border-transparent text-lavande",
            )}
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                courant
                  ? "border-transparent bg-white text-marine"
                  : fait
                    ? "border-transparent bg-ciel text-marine-deep"
                    : "border-[#6A71AE] text-lavande",
              )}
            >
              {fait ? "✓" : n}
            </span>
            <span>{libelle}</span>
          </li>
        );
      })}
    </ol>
  );
}
