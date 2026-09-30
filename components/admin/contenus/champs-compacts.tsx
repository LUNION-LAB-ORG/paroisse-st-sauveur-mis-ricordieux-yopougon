"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

const SAISIE =
  "w-full min-w-0 rounded-admin border border-champ bg-white px-2 py-2 text-sm font-normal text-encre outline-none focus:border-marine disabled:cursor-not-allowed disabled:bg-entete-admin disabled:text-gris";

interface SaisieCompacteProps {
  label?: string;
  /** Libellé accessible quand il n'est pas affiché */
  ariaLabel?: string;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "time" | "number" | "date" | "url";
  placeholder?: string;
  erreur?: string;
  isDisabled?: boolean;
  min?: number;
  maxLength?: number;
  className?: string;
  saisieClassName?: string;
}

/** Champ compact des fiches (« Heure », « Lieu », « Intentions max. »). */
export function SaisieCompacte({
  label,
  ariaLabel,
  value,
  onChange,
  type = "text",
  placeholder,
  erreur,
  isDisabled,
  min,
  maxLength,
  className,
  saisieClassName,
}: SaisieCompacteProps) {
  const id = useId();

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      {label && (
        <label className="text-[13px] font-semibold" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        aria-describedby={erreur ? `${id}-e` : undefined}
        aria-invalid={!!erreur || undefined}
        aria-label={label ? undefined : ariaLabel}
        className={cn(SAISIE, erreur && "border-rouge", saisieClassName)}
        disabled={isDisabled}
        id={id}
        maxLength={maxLength}
        min={min}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {erreur && (
        <span className="text-xs text-rouge" id={`${id}-e`}>
          {erreur}
        </span>
      )}
    </div>
  );
}

interface ChoixCompactProps {
  label?: string;
  ariaLabel?: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly { valeur: string; label: string }[];
  isDisabled?: boolean;
  erreur?: string;
  className?: string;
  saisieClassName?: string;
}

/** Liste déroulante native compacte. */
export function ChoixCompact({
  label,
  ariaLabel,
  value,
  onChange,
  options,
  isDisabled,
  erreur,
  className,
  saisieClassName,
}: ChoixCompactProps) {
  const id = useId();

  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)}>
      {label && (
        <label className="text-[13px] font-semibold" htmlFor={id}>
          {label}
        </label>
      )}
      <select
        aria-invalid={!!erreur || undefined}
        aria-label={label ? undefined : ariaLabel}
        className={cn(SAISIE, erreur && "border-rouge", saisieClassName)}
        disabled={isDisabled}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.valeur} value={o.valeur}>
            {o.label}
          </option>
        ))}
      </select>
      {erreur && <span className="text-xs text-rouge">{erreur}</span>}
    </div>
  );
}

/** Case à cocher native de la maquette (18 px, cochée en marine). */
export function CaseNative({
  valeur,
  onChange,
  children,
  isDisabled,
  className,
  taille = 18,
}: {
  valeur: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
  isDisabled?: boolean;
  className?: string;
  taille?: 16 | 18;
}) {
  return (
    <label
      className={cn(
        "flex items-center gap-2 text-sm",
        isDisabled ? "cursor-not-allowed text-gris" : "cursor-pointer",
        className,
      )}
    >
      <input
        checked={valeur}
        className={cn(
          "shrink-0 accent-marine",
          taille === 16 ? "size-4" : "size-[18px]",
        )}
        disabled={isDisabled}
        type="checkbox"
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{children}</span>
    </label>
  );
}
