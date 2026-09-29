"use client";

import { Tabs } from "@heroui/react";

import { cn } from "@/lib/utils";

interface OngletsFiltreProps {
  valeurs: readonly string[];
  valeur: string;
  onChange: (v: string) => void;
  label: string;
  className?: string;
}

/** Filtres soulignés en rouge (Annonces, Communauté, Mouvements). */
export function OngletsFiltre({
  valeurs,
  valeur,
  onChange,
  label,
  className,
}: OngletsFiltreProps) {
  return (
    <Tabs
      className={cn("tabs-charte", className)}
      selectedKey={valeur}
      variant="secondary"
      onSelectionChange={(k) => onChange(String(k))}
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label={label} className="gap-[26px]">
          {valeurs.map((v) => (
            <Tabs.Tab
              key={v}
              className="w-auto shrink-0 pb-3.5 pt-2.5 text-base"
              id={v}
            >
              {v}
              <Tabs.Indicator />
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </Tabs.ListContainer>
    </Tabs>
  );
}
