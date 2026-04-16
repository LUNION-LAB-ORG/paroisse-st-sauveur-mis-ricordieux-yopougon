"use client";
import { Button, Select, Label, ListBox } from "@heroui/react";

export const filters = [
  { key: "clocher", label: "Rénovation du clocher" },
  { key: "salle", label: "Rénovation de la salle" },
  { key: "toiture", label: "Travaux de toiture" },
  { key: "jardin", label: "Aménagement du jardin" },
];

export default function FilterActualites() {
  return (
    <div className="w-full mb-4 flex flex-col md:flex-row gap-6 md:items-end">
      {/* Filtre thematique */}
      <div className="w-full lg:w-1/3">
        <Select>
          <Label>Choisir une thématique</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              {filters.map((item) => (
                <ListBox.Item key={item.key} id={item.key} textValue={item.label}>
                  {item.label}
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {/* Filtre date */}
      <div className="w-full lg:w-1/3">
        <Select>
          <Label>Date de l&apos;événement</Label>
          <Select.Trigger>
            <Select.Value />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox>
              <ListBox.Item id="date" textValue="JJ/MM/AAAA">JJ/MM/AAAA</ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      {/* Bouton */}
      <Button
        variant="primary"
        className="w-full lg:w-auto text-base lg:text-sm font-semibold py-4 lg:py-6 px-10"
      >
        Rechercher
      </Button>
    </div>
  );
}
