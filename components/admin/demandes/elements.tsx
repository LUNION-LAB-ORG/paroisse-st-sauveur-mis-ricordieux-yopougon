"use client";

/**
 * Éléments génériques supplémentaires des écrans « Demandes, finances,
 * équipe » (fenêtre de saisie, bouton indisponible, pagination, recherche).
 */
import { Modal } from "@heroui/react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { AIDE_WHATSAPP } from "./outils";

import { cn } from "@/lib/utils";

/** Fenêtre modale de saisie (formulaire), défilement interne. */
export function FenetreAdmin({
  ouverte,
  onFermer,
  titre,
  sousTitre,
  children,
  pied,
  taille = "md",
}: {
  ouverte: boolean;
  onFermer: () => void;
  titre: string;
  sousTitre?: React.ReactNode;
  children: React.ReactNode;
  pied?: React.ReactNode;
  taille?: "sm" | "md" | "lg";
}) {
  return (
    <Modal.Backdrop isOpen={ouverte} onOpenChange={(o) => !o && onFermer()}>
      <Modal.Container scroll="inside" size={taille}>
        <Modal.Dialog className="rounded-admin font-body text-encre">
          <Modal.CloseTrigger aria-label="Fermer" />
          <Modal.Header className="flex flex-col gap-1">
            <Modal.Heading className="font-heading text-lg font-extrabold text-marine">
              {titre}
            </Modal.Heading>
            {sousTitre && (
              <span className="text-sm font-normal text-gris">{sousTitre}</span>
            )}
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-4 py-2">
            {children}
          </Modal.Body>
          {pied && (
            <Modal.Footer className="flex flex-wrap justify-end gap-2.5">
              {pied}
            </Modal.Footer>
          )}
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}

/**
 * Bouton d'une fonction sans support serveur (ex. WhatsApp Business non
 * configuré) : désactivé, infobulle et aide visible.
 */
export function BoutonIndisponible({
  children,
  aide = AIDE_WHATSAPP,
  className,
  afficherAide = true,
  variante = "neutre",
}: {
  children: React.ReactNode;
  aide?: string;
  className?: string;
  afficherAide?: boolean;
  variante?: "neutre" | "marine";
}) {
  return (
    <span className={cn("flex flex-col gap-1", className)} title={aide}>
      <button
        disabled
        className={cn(
          "min-h-11 w-full cursor-not-allowed rounded-admin px-4 py-[11px] text-sm opacity-50",
          variante === "marine"
            ? "border-0 bg-marine font-bold text-white"
            : "border border-champ bg-white font-semibold text-encre",
        )}
        type="button"
      >
        {children}
      </button>
      {afficherAide && <span className="text-xs text-gris">{aide}</span>}
    </span>
  );
}

/** Pagination « Précédent / Suivant » d'un pied de liste. */
export function PaginationSimple({
  page,
  derniere,
  onChange,
}: {
  page: number;
  derniere: number;
  onChange: (p: number) => void;
}) {
  if (derniere <= 1) return null;

  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        aria-label="Page précédente"
        className="inline-flex size-8 items-center justify-center rounded-admin border border-bord-admin bg-white text-marine disabled:opacity-40"
        disabled={page <= 1}
        type="button"
        onClick={() => onChange(page - 1)}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span>
        Page {page} / {derniere}
      </span>
      <button
        aria-label="Page suivante"
        className="inline-flex size-8 items-center justify-center rounded-admin border border-bord-admin bg-white text-marine disabled:opacity-40"
        disabled={page >= derniere}
        type="button"
        onClick={() => onChange(page + 1)}
      >
        <ChevronRight className="size-4" />
      </button>
    </span>
  );
}

/** Champ de recherche de la barre de filtres (260 px à 1440 px). */
export function ChampRecherche({
  valeur,
  onChange,
  placeholder,
  label = "Rechercher",
  className,
}: {
  valeur: string;
  onChange: (v: string) => void;
  placeholder: string;
  label?: string;
  className?: string;
}) {
  return (
    <label className={cn("relative block w-full md:w-[260px]", className)}>
      <span className="sr-only">{label}</span>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gris"
      />
      <input
        className="min-h-10 w-full rounded-admin border border-champ bg-white py-2.5 pl-9 pr-3 text-sm text-encre placeholder:text-gris"
        placeholder={placeholder}
        type="search"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

/** Bandeau « consultation seule » quand le rôle ne peut pas modifier. */
export function LectureSeule({ children }: { children?: React.ReactNode }) {
  return (
    <p className="m-0 rounded-admin border border-bord-admin bg-info-fond px-4 py-2.5 text-sm text-marine">
      {children ??
        "Consultation seule : votre rôle ne permet pas de modifier cet écran."}
    </p>
  );
}

/** Liseré d'état en bas d'un formulaire (« Modifications non enregistrées »). */
export function EtatEnregistrement({
  etat,
}: {
  etat: "propre" | "modifie" | "enregistre";
}) {
  const texte =
    etat === "enregistre"
      ? "Enregistré — visible sur le site en moins d’une minute"
      : etat === "modifie"
        ? "Modifications non enregistrées"
        : "Aucune modification en cours";

  return (
    <span
      aria-live="polite"
      className={cn(
        "text-[13px]",
        etat === "enregistre"
          ? "text-succes"
          : etat === "modifie"
            ? "text-attention"
            : "text-gris",
      )}
    >
      {texte}
    </span>
  );
}
