"use client";
import { Select, Label, ListBox } from "@heroui/react";

const projets = [
  { key: "fonctionnement", label: "Fonctionnement général" },
  { key: "renovation-chapelle", label: "Rénovation de la chapelle" },
  { key: "aide-demunis", label: "Aide aux plus démunis" },
  { key: "catechese", label: "Catéchèse et formation" },
  { key: "autre", label: "Autre projet" },
];

export default function SelectDon() {
  return (
    <Select placeholder="Choisir un projet" className="w-full">
      <Label>Affecter votre don à</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          {projets.map((p) => (
            <ListBox.Item key={p.key} id={p.key} textValue={p.label}>
              {p.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
