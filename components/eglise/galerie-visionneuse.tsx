"use client";

import { Button, Modal } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface GalerieVisionneuseProps {
  photos: string[];
  /** Préfixe du texte alternatif : « Chantier de la nouvelle église » */
  legende: string;
  className?: string;
}

/** Mosaïque de photos + visionneuse plein écran (flèches, clavier ←/→). */
export function GalerieVisionneuse({
  photos,
  legende,
  className,
}: GalerieVisionneuseProps) {
  const [index, setIndex] = useState<number | null>(null);
  const ouvert = index !== null;
  const total = photos.length;

  const aller = useCallback(
    (pas: number) =>
      setIndex((i) => (i === null ? i : (i + pas + total) % total)),
    [total],
  );

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") aller(-1);
      if (e.key === "ArrowRight") aller(1);
    };

    window.addEventListener("keydown", surTouche);

    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert, aller]);

  return (
    <>
      <ul
        className={cn(
          "m-0 grid list-none grid-cols-2 gap-2 p-0 sm:grid-cols-3 lg:grid-cols-4",
          className,
        )}
      >
        {photos.map((src, i) => (
          <li key={`${src}-${i}`} className="min-w-0">
            <button
              aria-label={`Agrandir : ${legende}, vue ${i + 1} sur ${total}`}
              className="block w-full overflow-hidden rounded-charte bg-lin focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rouge"
              type="button"
              onClick={() => setIndex(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="block h-[140px] w-full object-cover transition-transform duration-300 hover:scale-[1.03] sm:h-[180px] lg:h-[200px]"
                loading="lazy"
                src={src}
              />
            </button>
          </li>
        ))}
      </ul>

      <Modal.Backdrop
        isOpen={ouvert}
        variant="opaque"
        onOpenChange={(v) => !v && setIndex(null)}
      >
        <Modal.Container placement="center" size="full">
          <Modal.Dialog
            aria-label={`${legende} : visionneuse`}
            className="flex h-full flex-col rounded-none bg-marine-deep p-0 text-white"
          >
            <Modal.CloseTrigger
              aria-label="Fermer la visionneuse"
              className="z-10 size-11 bg-white text-marine"
            />
            {index !== null && (
              <div className="flex min-h-0 grow flex-col gap-3 p-4 lg:p-8">
                <div className="flex min-h-0 grow items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${legende}, vue ${index + 1} sur ${total}`}
                    className="max-h-full max-w-full object-contain"
                    src={photos[index]}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <Button
                    isIconOnly
                    aria-label="Photo précédente"
                    className="size-11 min-w-11 rounded-charte border border-white bg-transparent text-white"
                    isDisabled={total < 2}
                    variant="ghost"
                    onPress={() => aller(-1)}
                  >
                    <ChevronLeft aria-hidden className="size-5" />
                  </Button>
                  <span aria-live="polite" className="text-sm text-brume">
                    {index + 1} / {total}
                  </span>
                  <Button
                    isIconOnly
                    aria-label="Photo suivante"
                    className="size-11 min-w-11 rounded-charte border border-white bg-transparent text-white"
                    isDisabled={total < 2}
                    variant="ghost"
                    onPress={() => aller(1)}
                  >
                    <ChevronRight aria-hidden className="size-5" />
                  </Button>
                </div>
              </div>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}
