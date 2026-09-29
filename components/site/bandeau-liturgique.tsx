import type { ILiturgie } from "@/features/liturgie/types/liturgie.type";

import { CONTENEUR, dateLongue } from "@/lib/charte";
import { cn } from "@/lib/utils";

interface BandeauLiturgiqueProps {
  liturgie: ILiturgie | null;
  telephone: string;
  email: string;
}

/** Bandeau marine au-dessus de l'en-tête : jour liturgique + coordonnées (desktop). */
export function BandeauLiturgique({
  liturgie,
  telephone,
  email,
}: BandeauLiturgiqueProps) {
  return (
    <div className="hidden bg-marine text-[13px] text-brume lg:block">
      <div
        className={cn(
          CONTENEUR,
          "flex h-10 items-center justify-between gap-6",
        )}
      >
        <span className="truncate">
          {liturgie ? (
            <>
              {dateLongue(liturgie.date)} — {liturgie.feast}
              {liturgie.color && <> · Couleur liturgique : {liturgie.color}</>}
            </>
          ) : null}
        </span>
        <div className="flex shrink-0 gap-7">
          {telephone && (
            <a
              className="text-brume hover:text-white"
              href={`tel:${telephone.replace(/\s/g, "")}`}
            >
              {telephone}
            </a>
          )}
          {email && (
            <a className="text-brume hover:text-white" href={`mailto:${email}`}>
              {email}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
