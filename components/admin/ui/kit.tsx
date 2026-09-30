"use client";

/**
 * Kit de composants du back-office, d'après la maquette « Back-office — Paroisse
 * Saint Sauveur Miséricordieux » : fond #F4F2EE, cartes blanches bordées #E3DED4,
 * angles 4 px, titres Montserrat 800 marine, actions rouges.
 */
import {
  Button,
  Checkbox,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/* ─────────────────────────── Mise en page ─────────────────────────── */

interface EnTeteAdminProps {
  titre: React.ReactNode;
  sousTitre?: React.ReactNode;
  /** Boutons alignés à droite */
  actions?: React.ReactNode;
}

/** Barre d'en-tête blanche de 76 px, en haut de chaque écran. */
export function EnTeteAdmin({ titre, sousTitre, actions }: EnTeteAdminProps) {
  return (
    <header className="flex min-h-[76px] flex-col gap-3 border-b border-bord-admin bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-9 md:py-0">
      <div className="flex min-w-0 flex-col gap-0.5">
        <h1 className="m-0 truncate font-heading text-xl font-extrabold text-marine md:text-[22px]">
          {titre}
        </h1>
        {sousTitre && <span className="text-sm text-gris">{sousTitre}</span>}
      </div>
      {actions && (
        <div className="relative flex flex-wrap items-center gap-2.5">
          {actions}
        </div>
      )}
    </header>
  );
}

/** Zone de contenu sous l'en-tête. */
export function ContenuAdmin({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-[22px] px-4 py-6 md:px-9 [&>*]:min-w-0",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CarteProps {
  titre?: React.ReactNode;
  /** Élément à droite du titre (lien, compteur, bouton) */
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  corpsClassName?: string;
  /** Liseré marine de 4 px en haut (fiches) */
  accent?: boolean;
  as?: "section" | "aside" | "div";
}

/** Carte blanche ; avec `titre`, en-tête séparé par un filet. */
export function Carte({
  titre,
  action,
  children,
  className,
  corpsClassName,
  accent,
  as: Balise = "section",
}: CarteProps) {
  return (
    <Balise
      className={cn(
        "rounded-admin border border-bord-admin bg-white",
        accent && "border-t-4 border-t-marine",
        className,
      )}
    >
      {titre && (
        <div className="flex items-center justify-between gap-4 border-b border-bord-admin px-5 py-4 md:px-[22px] md:py-[18px]">
          <h2 className="m-0 font-heading text-base font-extrabold text-marine">
            {titre}
          </h2>
          {action && <div className="shrink-0 text-sm">{action}</div>}
        </div>
      )}
      <div className={cn(titre ? "" : "", corpsClassName)}>{children}</div>
    </Balise>
  );
}

/** Titre de section à l'intérieur d'une carte ou d'une fiche. */
export function TitreSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "m-0 font-heading text-base font-extrabold text-marine",
        className,
      )}
    >
      {children}
    </h3>
  );
}

/* ─────────────────────────── Boutons ─────────────────────────── */

type VarianteBouton =
  | "primaire"
  | "marine"
  | "contour"
  | "neutre"
  | "danger"
  | "lien";

const STYLES_BOUTON: Record<VarianteBouton, string> = {
  primaire:
    "border-0 bg-rouge px-[18px] py-3 font-bold text-white hover:bg-rouge-hover",
  marine:
    "border-0 bg-marine px-[18px] py-3 font-bold text-white hover:bg-marine-deep",
  contour:
    "border border-marine bg-white px-4 py-[11px] font-bold text-marine hover:bg-selection-admin",
  neutre:
    "border border-champ bg-white px-4 py-[11px] font-semibold text-encre hover:bg-entete-admin",
  danger:
    "border border-rouge bg-white px-4 py-[11px] font-bold text-rouge hover:bg-[#FBEAED]",
  lien: "border-0 bg-transparent px-0 py-1 font-bold text-rouge underline-offset-4 hover:underline",
};

interface BoutonAdminProps {
  variante?: VarianteBouton;
  onPress?: () => void;
  href?: string;
  type?: "button" | "submit";
  isDisabled?: boolean;
  isPending?: boolean;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
  cible?: "_blank";
}

export function BoutonAdmin({
  variante = "neutre",
  onPress,
  href,
  type = "button",
  isDisabled,
  isPending,
  className,
  children,
  cible,
  ...rest
}: BoutonAdminProps) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-admin text-sm shadow-none transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    STYLES_BOUTON[variante],
    className,
  );

  if (href) {
    return (
      <Link
        aria-label={rest["aria-label"]}
        className={cn(
          classes,
          "hover:no-underline",
          variante === "primaire" || variante === "marine"
            ? "hover:text-white"
            : "",
        )}
        href={href}
        target={cible}
      >
        {children}
      </Link>
    );
  }

  return (
    <Button
      aria-label={rest["aria-label"]}
      className={cn(classes, "h-auto")}
      isDisabled={isDisabled}
      isPending={isPending}
      type={type}
      onPress={onPress}
    >
      {children}
    </Button>
  );
}

/* ─────────────────────────── Pastilles et filtres ─────────────────────────── */

export type TonPastille = "succes" | "attention" | "info" | "neutre" | "danger";

const STYLES_PASTILLE: Record<TonPastille, string> = {
  succes: "bg-succes-fond text-succes",
  attention: "bg-attention-fond text-attention",
  info: "bg-info-fond text-marine",
  neutre: "bg-neutre-fond text-gris",
  danger: "bg-[#FBEAED] text-rouge",
};

/** Pastille de statut (« Publiée », « À régler », « Brouillon »…). */
export function Pastille({
  ton = "neutre",
  children,
  className,
}: {
  ton?: TonPastille;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-xl px-2.5 py-[3px] text-xs font-bold",
        STYLES_PASTILLE[ton],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Compteur rouge du menu latéral. */
export function Compteur({ valeur }: { valeur: number }) {
  if (!valeur) return null;

  return (
    <span className="rounded-[10px] bg-rouge px-[7px] py-px text-xs font-bold text-white">
      {valeur > 99 ? "99+" : valeur}
    </span>
  );
}

interface FiltresProps<T extends string> {
  options: readonly { valeur: T; label: string; compte?: number }[];
  valeur: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}

/** Filtres en pastilles (fond marine quand actif). */
export function Filtres<T extends string>({
  options,
  valeur,
  onChange,
  label,
  className,
}: FiltresProps<T>) {
  return (
    <div
      aria-label={label}
      className={cn("flex flex-wrap gap-1.5", className)}
      role="radiogroup"
    >
      {options.map((o) => {
        const actif = o.valeur === valeur;

        return (
          <button
            key={o.valeur}
            aria-checked={actif}
            className={cn(
              "min-h-9 rounded-admin border px-3.5 py-2 text-sm",
              actif
                ? "border-marine bg-marine font-bold text-white"
                : "border-bord-admin bg-white font-medium text-encre hover:border-champ",
            )}
            role="radio"
            type="button"
            onClick={() => onChange(o.valeur)}
          >
            {o.label}
            {o.compte !== undefined && (
              <span
                className={cn(
                  "ml-1.5 text-xs",
                  actif ? "text-brume" : "text-gris",
                )}
              >
                {o.compte}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ─────────────────────────── Tableau ─────────────────────────── */

export interface IColonne<T> {
  cle: string;
  titre: React.ReactNode;
  rendu: (ligne: T) => React.ReactNode;
  className?: string;
  /** Masquée sous 768 px */
  secondaire?: boolean;
}

interface TableauAdminProps<T> {
  colonnes: IColonne<T>[];
  lignes: T[];
  cleLigne: (l: T) => string | number;
  onChoisir?: (l: T) => void;
  selection?: string | number | null;
  vide?: React.ReactNode;
  chargement?: boolean;
}

/** Tableau de la maquette : en-tête #FAF8F4, lignes séparées #F0ECE4, ligne choisie #EEF1FA. */
export function TableauAdmin<T>({
  colonnes,
  lignes,
  cleLigne,
  onChoisir,
  selection,
  vide,
  chargement,
}: TableauAdminProps<T>) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-entete-admin text-left text-[13px] text-gris">
            {colonnes.map((c, i) => (
              <th
                key={c.cle}
                className={cn(
                  "px-2.5 py-[11px] font-semibold",
                  i === 0 && "pl-5",
                  i === colonnes.length - 1 && "pr-5",
                  c.secondaire && "hidden md:table-cell",
                  c.className,
                )}
                scope="col"
              >
                {c.titre}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {chargement ? (
            <tr>
              <td
                className="px-5 py-8 text-center text-gris"
                colSpan={colonnes.length}
              >
                Chargement…
              </td>
            </tr>
          ) : lignes.length === 0 ? (
            <tr>
              <td
                className="px-5 py-8 text-center text-gris"
                colSpan={colonnes.length}
              >
                {vide ?? "Aucun élément."}
              </td>
            </tr>
          ) : (
            lignes.map((l) => {
              const cle = cleLigne(l);
              const choisie = selection !== undefined && selection === cle;

              return (
                <tr
                  key={cle}
                  aria-selected={onChoisir ? choisie : undefined}
                  className={cn(
                    "border-t border-ligne-admin",
                    onChoisir &&
                      "cursor-pointer hover:bg-entete-admin focus-visible:outline-2 focus-visible:outline-marine",
                    choisie && "bg-selection-admin hover:bg-selection-admin",
                  )}
                  tabIndex={onChoisir ? 0 : undefined}
                  onClick={onChoisir ? () => onChoisir(l) : undefined}
                  onKeyDown={
                    onChoisir
                      ? (e) =>
                          (e.key === "Enter" || e.key === " ") &&
                          (e.preventDefault(), onChoisir(l))
                      : undefined
                  }
                >
                  {colonnes.map((c, i) => (
                    <td
                      key={c.cle}
                      className={cn(
                        "px-2.5 py-[13px] align-middle",
                        i === 0 && "pl-5",
                        i === colonnes.length - 1 && "pr-5",
                        c.secondaire && "hidden md:table-cell",
                        c.className,
                      )}
                    >
                      {c.rendu(l)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

/** Pied de liste (« 7 demande(s) affichée(s) · Cliquez sur une ligne… »). */
export function PiedListe({
  gauche,
  droite,
}: {
  gauche: React.ReactNode;
  droite?: React.ReactNode;
}) {
  return (
    <div className="mt-auto flex flex-wrap justify-between gap-2 border-t border-bord-admin px-5 py-3.5 text-[13px] text-gris">
      <span>{gauche}</span>
      {droite && <span>{droite}</span>}
    </div>
  );
}

/* ─────────────────────────── Champs ─────────────────────────── */

const LIBELLE = "text-sm font-bold text-encre";
const SAISIE =
  "w-full rounded-admin border border-champ bg-white px-3 py-[11px] text-[15px] font-normal text-encre shadow-none";
const AIDE = "text-[13px] font-normal text-gris";
const ERREUR = "text-[13px] text-rouge";

interface ChampBase {
  label: React.ReactNode;
  aide?: React.ReactNode;
  erreur?: string;
  className?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}

interface ChampTexteAdminProps extends ChampBase {
  value: string;
  onChange: (v: string) => void;
  type?:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "number"
    | "date"
    | "datetime-local"
    | "time"
    | "password"
    | "search";
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
}

export function ChampTexteAdmin({
  label,
  aide,
  erreur,
  className,
  value,
  onChange,
  type = "text",
  placeholder,
  maxLength,
  isDisabled,
  isRequired,
  autoComplete,
}: ChampTexteAdminProps) {
  return (
    <TextField
      className={cn("flex flex-col gap-1.5", className)}
      isDisabled={isDisabled}
      isInvalid={!!erreur}
      isRequired={isRequired}
      maxLength={maxLength}
      type={type}
      value={value}
      onChange={onChange}
    >
      <Label className={LIBELLE}>{label}</Label>
      <Input
        autoComplete={autoComplete}
        className={cn(SAISIE, "min-h-11")}
        placeholder={placeholder}
      />
      {aide && !erreur && <span className={AIDE}>{aide}</span>}
      <FieldError className={ERREUR}>{erreur}</FieldError>
    </TextField>
  );
}

interface ChampZoneAdminProps extends ChampBase {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
  /** Affiche « n / max » sous le champ */
  compteur?: boolean;
}

export function ChampZoneAdmin({
  label,
  aide,
  erreur,
  className,
  value,
  onChange,
  rows = 4,
  placeholder,
  maxLength,
  compteur,
  isDisabled,
}: ChampZoneAdminProps) {
  return (
    <TextField
      className={cn("flex flex-col gap-1.5", className)}
      isDisabled={isDisabled}
      isInvalid={!!erreur}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
    >
      <Label className={LIBELLE}>{label}</Label>
      <TextArea
        className={cn(SAISIE, "resize-y leading-[1.55]")}
        placeholder={placeholder}
        rows={rows}
      />
      {(aide || (compteur && maxLength)) && !erreur && (
        <span className={cn(AIDE, "flex justify-between gap-3")}>
          <span>{aide}</span>
          {compteur && maxLength && (
            <span className="shrink-0">
              {value.length} / {maxLength}
            </span>
          )}
        </span>
      )}
      <FieldError className={ERREUR}>{erreur}</FieldError>
    </TextField>
  );
}

interface ChampChoixAdminProps extends ChampBase {
  value: string;
  onChange: (v: string) => void;
  options: readonly { valeur: string; label: string }[];
  placeholder?: string;
}

export function ChampChoixAdmin({
  label,
  aide,
  erreur,
  className,
  value,
  onChange,
  options,
  placeholder,
  isDisabled,
}: ChampChoixAdminProps) {
  return (
    <Select
      className={cn("flex flex-col gap-1.5", className)}
      isDisabled={isDisabled}
      isInvalid={!!erreur}
      placeholder={placeholder}
      selectedKey={value || null}
      onSelectionChange={(k) => onChange(k == null ? "" : String(k))}
    >
      <Label className={LIBELLE}>{label}</Label>
      <Select.Trigger
        className={cn(SAISIE, "flex min-h-11 items-center justify-between")}
      >
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((o) => (
            <ListBox.Item key={o.valeur} id={o.valeur} textValue={o.label}>
              {o.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
      {aide && !erreur && <span className={AIDE}>{aide}</span>}
      {erreur && <span className={ERREUR}>{erreur}</span>}
    </Select>
  );
}

interface CaseAdminProps {
  valeur: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
}

/** Case à cocher de la maquette (18 px, cochée en marine). */
export function CaseAdmin({
  valeur,
  onChange,
  children,
  isDisabled,
  className,
}: CaseAdminProps) {
  return (
    <Checkbox
      className={cn("group", className)}
      isDisabled={isDisabled}
      isSelected={valeur}
      onChange={onChange}
    >
      <Checkbox.Content className="flex flex-row items-center gap-2.5 text-sm font-semibold text-encre">
        <Checkbox.Control className="size-[18px] shrink-0 rounded-[3px] border border-champ bg-white group-data-[selected=true]:border-marine group-data-[selected=true]:bg-marine group-data-[selected=true]:text-white">
          <Checkbox.Indicator />
        </Checkbox.Control>
        {children}
      </Checkbox.Content>
    </Checkbox>
  );
}

/* ─────────────────────────── Fiches et états ─────────────────────────── */

/** Liste « libellé / valeur » des fiches (grille 110 px / reste). */
export function DetailsFiche({
  lignes,
  largeurLibelle = 110,
}: {
  lignes: { libelle: string; valeur: React.ReactNode }[];
  largeurLibelle?: number;
}) {
  return (
    <dl
      className="m-0 grid gap-y-2.5 text-sm"
      style={{ gridTemplateColumns: `${largeurLibelle}px minmax(0, 1fr)` }}
    >
      {lignes.map((l) => (
        <div key={l.libelle} className="contents">
          <dt className="text-gris">{l.libelle}</dt>
          <dd className="m-0 min-w-0 break-words font-semibold">{l.valeur}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Encadré beige (« Texte de l'intention »). */
export function Encart({
  titre,
  children,
  className,
}: {
  titre?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 border border-encart-admin bg-entete-admin p-3.5 text-sm leading-[1.55]",
        className,
      )}
    >
      {titre && <span className="text-xs font-bold text-gris">{titre}</span>}
      {children}
    </div>
  );
}

/** Bandeau d'avertissement ambré (« Intention confidentielle… »). */
export function Avertissement({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "m-0 bg-attention-fond px-2.5 py-2 text-[13px] font-bold text-attention",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function EtatVide({ children }: { children: React.ReactNode }) {
  return (
    <p className="m-0 px-5 py-8 text-center text-sm text-gris">{children}</p>
  );
}

/** Message d'erreur de chargement avec bouton « Réessayer ». */
export function ErreurChargement({
  onReessayer,
  message = "Le chargement a échoué.",
}: {
  onReessayer?: () => void;
  message?: string;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 rounded-admin border border-rouge/30 bg-[#FBEAED] px-4 py-3 text-sm text-rouge"
      role="alert"
    >
      <span>{message}</span>
      {onReessayer && (
        <button
          className="font-bold underline"
          type="button"
          onClick={onReessayer}
        >
          Réessayer
        </button>
      )}
    </div>
  );
}

/** Grille « liste + fiche » des écrans (colonne de droite 380 px). */
export function GrilleListeFiche({
  liste,
  fiche,
  largeurFiche = 380,
}: {
  liste: React.ReactNode;
  fiche: React.ReactNode;
  largeurFiche?: number;
}) {
  return (
    <div
      className="grid grid-cols-1 items-start gap-[22px] xl:[grid-template-columns:minmax(0,1fr)_var(--largeur-fiche)]"
      style={{ ["--largeur-fiche" as string]: `${largeurFiche}px` }}
    >
      {liste}
      {fiche}
    </div>
  );
}
