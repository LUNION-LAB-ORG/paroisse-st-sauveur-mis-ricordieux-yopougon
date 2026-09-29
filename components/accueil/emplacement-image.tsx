import { cn } from "@/lib/utils";

interface EmplacementImageProps {
  src?: string | null;
  alt: string;
  libelle: string;
  className?: string;
  surFondMarine?: boolean;
}

/**
 * Image pilotée par le back-office ; tant qu'elle n'est pas fournie, on affiche
 * l'emplacement réservé de la maquette (« [Portrait] », « [Photo du groupe] »…).
 */
export function EmplacementImage({
  src,
  alt,
  libelle,
  className,
  surFondMarine,
}: EmplacementImageProps) {
  if (src) {
    return (
      <img
        alt={alt}
        className={cn("block object-cover", className)}
        loading="lazy"
        src={src}
      />
    );
  }

  return (
    <div
      aria-label={alt}
      className={cn(
        "flex items-center justify-center text-center text-[13px] lg:text-sm",
        surFondMarine
          ? "bg-marine-soft text-lavande"
          : "bg-lin text-gris-clair",
        className,
      )}
      role="img"
    >
      [{libelle}]
    </div>
  );
}
