"use client";

import {
  Button,
  Checkbox,
  Label,
  ListBox,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatMontant } from "@/lib/charte";
import { cn } from "@/lib/utils";

/**
 * Moyens de paiement de la maquette. Seul Wave est branché aujourd'hui ; les
 * autres attendent le choix de l'agrégateur (point ouvert des spécifications).
 */
const MOYENS = [
  { id: "wave", label: "Wave", disponible: true },
  { id: "orange", label: "Orange Money", disponible: false },
  { id: "mtn", label: "MTN MoMo", disponible: false },
  { id: "moov", label: "Moov Money", disponible: false },
  { id: "carte", label: "Carte bancaire", disponible: false },
] as const;

interface DonRapideProps {
  montants: number[];
  projet: string;
  logo: string;
}

export function DonRapide({ montants, projet, logo }: DonRapideProps) {
  const router = useRouter();
  const [montant, setMontant] = useState<number>(
    montants[Math.min(2, montants.length - 1)] ?? 25000,
  );
  const [moyen, setMoyen] = useState<string>("wave");
  const [bienfaiteur, setBienfaiteur] = useState(false);

  const donner = () => {
    const params = new URLSearchParams({
      montant: String(montant),
      projet,
      moyen,
      ...(bienfaiteur ? { bienfaiteur: "1" } : {}),
    });

    router.push(`/faire-don?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3.5 rounded-charte bg-white p-5 text-encre lg:gap-5 lg:p-[34px]">
      <div className="flex flex-row items-center gap-2.5 lg:gap-3.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          aria-hidden
          alt=""
          className="size-10 rounded-full object-cover lg:size-[52px]"
          src={logo}
        />
        <span className="font-heading text-base font-extrabold uppercase tracking-[.02em] text-marine lg:text-2xl">
          Faire un don
        </span>
      </div>

      <ToggleButtonGroup
        disallowEmptySelection
        aria-label="Montant du don en FCFA"
        className="grid w-full grid-cols-3 gap-2"
        selectedKeys={new Set([String(montant)])}
        selectionMode="single"
        onSelectionChange={(cles) => {
          const cle = Array.from(cles)[0];

          if (cle !== undefined) setMontant(Number(cle));
        }}
      >
        {montants.map((v) => (
          <ToggleButton
            key={v}
            className={cn(
              "h-auto min-h-11 w-full rounded-charte border border-champ bg-white py-[13px] text-base font-semibold text-encre",
              "data-[selected=true]:border-marine data-[selected=true]:bg-marine data-[selected=true]:text-white",
            )}
            id={String(v)}
          >
            {formatMontant(v)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Select
        className="hidden flex-col gap-1.5 lg:flex"
        disabledKeys={MOYENS.filter((m) => !m.disponible).map((m) => m.id)}
        selectedKey={moyen}
        onSelectionChange={(k) => k && setMoyen(String(k))}
      >
        <Label className="text-sm font-semibold text-encre">
          Moyen de paiement
        </Label>
        <Select.Trigger className="min-h-11 rounded-charte border border-champ bg-white px-3 text-base">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {MOYENS.map((m) => (
              <ListBox.Item key={m.id} id={m.id} textValue={m.label}>
                {m.label}
                {!m.disponible && (
                  <span className="ml-auto text-xs text-gris">bientôt</span>
                )}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      <Checkbox
        className="group hidden lg:flex"
        isSelected={bienfaiteur}
        onChange={setBienfaiteur}
      >
        <Checkbox.Content className="flex flex-row items-center gap-2.5 text-sm text-encre-douce">
          <Checkbox.Control className="size-[18px] rounded-[2px] border border-champ bg-white group-data-[selected=true]:border-rouge group-data-[selected=true]:bg-rouge group-data-[selected=true]:text-white">
            <Checkbox.Indicator />
          </Checkbox.Control>
          Faire figurer mon nom parmi les bienfaiteurs
        </Checkbox.Content>
      </Checkbox>

      <Button
        className="h-auto min-h-11 w-full rounded-charte bg-rouge p-[15px] text-base font-bold text-white hover:bg-rouge-hover lg:p-[17px] lg:text-[17px]"
        onPress={donner}
      >
        Donner {formatMontant(montant)} FCFA
      </Button>
      <span className="hidden text-[13px] text-gris lg:block">
        Un reçu vous est envoyé par SMS ou WhatsApp.
      </span>
      <span className="text-center text-xs text-gris lg:hidden">
        Paiement sécurisé par Wave · autres moyens bientôt
      </span>
    </div>
  );
}
