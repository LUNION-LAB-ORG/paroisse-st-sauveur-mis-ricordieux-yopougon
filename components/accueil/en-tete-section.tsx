import { cn } from "@/lib/utils";

interface EnTeteSectionProps {
  numero?: string;
  surtitre: string;
  titre: string;
  surFondMarine?: boolean;
  className?: string;
  titreClassName?: string;
}

/** « 01 — Horaires » + titre de section, commun aux blocs de l'accueil. */
export function EnTeteSection({
  numero,
  surtitre,
  titre,
  surFondMarine,
  className,
  titreClassName,
}: EnTeteSectionProps) {
  return (
    <div className={cn("flex flex-col gap-2 lg:gap-[18px]", className)}>
      <span
        className={cn(
          "text-[13px] font-bold lg:text-sm",
          surFondMarine ? "text-ciel" : "text-rouge",
        )}
      >
        {numero && <span className="hidden lg:inline">{numero} — </span>}
        {surtitre}
      </span>
      <h2
        className={cn(
          "m-0 font-heading text-[22px] font-extrabold leading-[1.15] lg:text-4xl lg:font-bold lg:leading-[1.05] lg:tracking-[-0.015em]",
          surFondMarine ? "text-white" : "text-marine",
          titreClassName,
        )}
      >
        {titre}
      </h2>
    </div>
  );
}
