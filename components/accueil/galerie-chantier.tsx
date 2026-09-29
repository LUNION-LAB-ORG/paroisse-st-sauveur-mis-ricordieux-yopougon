import Link from "next/link";

import { EmplacementImage } from "./emplacement-image";

/** Vignettes du chantier ; la galerie complète (visionneuse) est sur la page du projet. */
export function GalerieChantier({ photos }: { photos: string[] }) {
  const vignettes = [0, 1, 2].map((i) => photos[i] ?? null);

  return (
    <>
      {vignettes.map((src, i) => (
        <EmplacementImage
          key={i}
          surFondMarine
          alt={`Chantier de la nouvelle église, vue ${i + 1}`}
          className="h-[90px] w-full"
          libelle={`Chantier ${i + 1}`}
          src={src}
        />
      ))}
      <Link
        className="flex h-[90px] items-center justify-center border border-marine-line text-center text-sm font-bold text-ciel hover:bg-marine-soft hover:text-white hover:no-underline"
        href="/nouvelle-eglise#galerie"
      >
        Galerie du chantier
      </Link>
    </>
  );
}
