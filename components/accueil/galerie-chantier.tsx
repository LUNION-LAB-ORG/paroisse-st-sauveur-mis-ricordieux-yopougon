"use client";

import { Modal } from "@heroui/react";

import { EmplacementImage } from "./emplacement-image";

/** Vignettes du chantier + galerie complète en fenêtre modale. */
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
      {photos.length === 0 ? (
        <span className="flex h-[90px] items-center justify-center border border-marine-line text-center text-sm font-bold text-lavande">
          Galerie du chantier
        </span>
      ) : (
        <Modal>
          <Modal.Trigger className="flex h-[90px] items-center justify-center border border-marine-line text-sm font-bold text-ciel hover:bg-marine-soft">
            Galerie du chantier
          </Modal.Trigger>
          <Modal.Backdrop>
            <Modal.Container size="lg">
              <Modal.Dialog className="rounded-charte">
                <Modal.CloseTrigger aria-label="Fermer la galerie" />
                <Modal.Header>
                  <Modal.Heading className="font-heading text-xl font-bold text-marine">
                    Galerie du chantier
                  </Modal.Heading>
                </Modal.Header>
                <Modal.Body className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {photos.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      alt={`Chantier de la nouvelle église, vue ${i + 1}`}
                      className="w-full rounded-charte object-cover"
                      loading="lazy"
                      src={src}
                    />
                  ))}
                </Modal.Body>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}
    </>
  );
}
