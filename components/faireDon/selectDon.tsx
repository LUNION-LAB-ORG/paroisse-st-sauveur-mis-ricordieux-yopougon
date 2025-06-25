"use client";
import { Select, SelectItem } from "@heroui/select";

export const animals = [
  { key: "cat", label: "Renovation de clocher" },
  { key: "dog", label: "Renovation de la cher" },
  { key: "elephant", label: "Renovation de clocher" },
  { key: "lion", label: "Lion" },
];

export default function SelectDon() {
  return (
    <div className="w-md mb-4">
      <Select className="w-full " label="Renovation de clocher" size="md">
        {animals.map((animal) => (
          <SelectItem key={animal.key} className="text-lg">{animal.label}</SelectItem>
        ))}
      </Select>
    </div>
  );
}
