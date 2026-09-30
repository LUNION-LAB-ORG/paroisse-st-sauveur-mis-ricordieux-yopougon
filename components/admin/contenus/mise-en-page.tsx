"use client";

import { Modal } from "@heroui/react";
import Link from "next/link";

import { Avertissement } from "@/components/admin/ui/kit";

/** Fenêtre de saisie (exception d'horaire…). */
export function FenetreAdmin({
  ouverte,
  onFermer,
  titre,
  children,
  pied,
}: {
  ouverte: boolean;
  onFermer: () => void;
  titre: string;
  children: React.ReactNode;
  pied: React.ReactNode;
}) {
  return (
    <Modal.Backdrop isOpen={ouverte} onOpenChange={(o) => !o && onFermer()}>
      <Modal.Container size="md">
        <Modal.Dialog className="rounded-admin">
          <Modal.Header>
            <Modal.Heading className="font-heading text-lg font-extrabold text-marine">
              {titre}
            </Modal.Heading>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-3.5 text-sm">
            {children}
          </Modal.Body>
          <Modal.Footer className="flex flex-wrap justify-end gap-2.5">
            {pied}
          </Modal.Footer>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

/** En-tête d'écran avec fil d'Ariane au-dessus du titre (éditeur de publication). */
export function EnTeteFil({
  fil,
  titre,
  actions,
}: {
  fil: { label: string; href?: string }[];
  titre: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex min-h-[76px] flex-col gap-3 border-b border-bord-admin bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-9 md:py-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <nav aria-label="Fil d’Ariane" className="text-[13px] text-gris">
          {fil.map((f, i) => (
            <span key={f.label}>
              {i > 0 && " / "}
              {f.href ? (
                <Link
                  className="text-rouge hover:text-rouge-hover"
                  href={f.href}
                >
                  {f.label}
                </Link>
              ) : (
                <span aria-current="page">{f.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="m-0 truncate font-heading text-xl font-extrabold text-marine md:text-[22px]">
          {titre}
        </h1>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </header>
  );
}

/** Bandeau « consultation seule » quand le rôle ne peut pas modifier le module. */
export function LectureSeule({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <Avertissement>
      Consultation seule : votre rôle ne permet pas de modifier ce module.
    </Avertissement>
  );
}
