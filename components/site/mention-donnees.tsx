import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Mention d'information sous chaque formulaire (loi n° 2013-450) : finalité
 * des données saisies + lien vers la politique de confidentialité.
 */
export function MentionDonnees({
  finalite,
  className,
  surFondMarine = false,
}: {
  /** Ex. « servent uniquement à confirmer votre demande de messe et à vous envoyer le reçu » */
  finalite: string;
  className?: string;
  surFondMarine?: boolean;
}) {
  return (
    <p
      className={cn(
        "m-0 text-xs leading-[1.5]",
        surFondMarine ? "text-brume" : "text-gris",
        className,
      )}
    >
      Vos données : elles {finalite}. Elles ne sont ni vendues ni cédées.{" "}
      <Link
        className={cn(
          "inline-flex font-semibold underline underline-offset-2",
          surFondMarine
            ? "text-white hover:text-white"
            : "text-marine hover:text-rouge",
        )}
        href="/confidentialite"
      >
        En savoir plus
      </Link>
    </p>
  );
}
