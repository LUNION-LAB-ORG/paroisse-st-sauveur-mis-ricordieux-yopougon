"use client";

import {
  Checkbox,
  FieldError,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";

import { cn } from "@/lib/utils";

/** Champs de formulaire aux couleurs de la charte (angles 2 px, bordure #C9C2B4, 44 px minimum). */
const LIBELLE = "text-sm font-semibold text-encre";
const SAISIE =
  "min-h-11 w-full rounded-charte border border-champ bg-white px-[13px] py-[13px] text-base text-encre shadow-none";
const ERREUR = "text-sm text-rouge";

interface ChampTexteProps {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  type?: "text" | "tel" | "email" | "number";
  placeholder?: string;
  erreur?: string;
  autoComplete?: string;
  name?: string;
  className?: string;
  maxLength?: number;
  inputMode?: "text" | "tel" | "email" | "numeric";
}

export function ChampTexte({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  erreur,
  autoComplete,
  name,
  className,
  maxLength,
  inputMode,
}: ChampTexteProps) {
  return (
    <TextField
      className={cn("flex flex-col gap-1.5", className)}
      inputMode={inputMode}
      isInvalid={!!erreur}
      maxLength={maxLength}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
    >
      <Label className={LIBELLE}>{label}</Label>
      <Input
        autoComplete={autoComplete}
        className={SAISIE}
        placeholder={placeholder}
      />
      <FieldError className={ERREUR}>{erreur}</FieldError>
    </TextField>
  );
}

interface ChampZoneProps extends Omit<
  ChampTexteProps,
  "type" | "autoComplete" | "inputMode"
> {
  rows?: number;
}

export function ChampZone({
  label,
  value,
  onChange,
  placeholder,
  erreur,
  name,
  className,
  maxLength,
  rows = 3,
}: ChampZoneProps) {
  return (
    <TextField
      className={cn("flex flex-col gap-1.5", className)}
      isInvalid={!!erreur}
      maxLength={maxLength}
      name={name}
      value={value}
      onChange={onChange}
    >
      <Label className={LIBELLE}>{label}</Label>
      <TextArea
        className={cn(SAISIE, "resize-y")}
        placeholder={placeholder}
        rows={rows}
      />
      <FieldError className={ERREUR}>{erreur}</FieldError>
    </TextField>
  );
}

interface ChampChoixProps {
  label: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  options: readonly { id: string; label: string }[];
  className?: string;
}

export function ChampChoix({
  label,
  value,
  onChange,
  options,
  className,
}: ChampChoixProps) {
  return (
    <Select
      className={cn("flex flex-col gap-1.5", className)}
      selectedKey={value}
      onSelectionChange={(k) => k != null && onChange(String(k))}
    >
      <Label className={LIBELLE}>{label}</Label>
      <Select.Trigger
        className={cn(SAISIE, "flex items-center justify-between")}
      >
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {options.map((o) => (
            <ListBox.Item key={o.id} id={o.id} textValue={o.label}>
              {o.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

/** Case à cocher de la charte (libellé à droite, coche marine). */
export function CaseACocher({
  valeur,
  onChange,
  children,
}: {
  valeur: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Checkbox className="group" isSelected={valeur} onChange={onChange}>
      <Checkbox.Content className="flex flex-row items-start gap-3 text-[15px] leading-[1.45] text-encre-douce">
        <Checkbox.Control className="mt-0.5 size-5 shrink-0 rounded-[2px] border border-champ bg-white group-data-[selected=true]:border-marine group-data-[selected=true]:bg-marine group-data-[selected=true]:text-white">
          <Checkbox.Indicator />
        </Checkbox.Control>
        {children}
      </Checkbox.Content>
    </Checkbox>
  );
}
