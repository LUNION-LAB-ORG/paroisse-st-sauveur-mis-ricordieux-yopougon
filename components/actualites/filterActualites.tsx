import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

export const filters = [
  { key: "clocher", label: "Rénovation du clocher" },
  { key: "salle", label: "Rénovation de la salle" },
  { key: "toiture", label: "Travaux de toiture" },
  { key: "jardin", label: "Aménagement du jardin" },
];

export default function FilterActualites() {
  return (
    <div className="w-full mb-4 flex flex-col md:flex-row gap-6 md:items-end">
      {/* Filtre thématique */}
      <Select
        className="w-full lg:w-1/3"
        label="Choisir une thématique"
        size="sm"
        variant="bordered"
      >
        {filters.map((item) => (
          <SelectItem key={item.key} className="text-lg">
            {item.label}
          </SelectItem>
        ))}
      </Select>

      {/* Filtre date */}
      <Select
        className="w-full lg:w-1/3"
        label="Date de l'évènement"
        size="sm"
        variant="bordered"
      >
        <SelectItem className="text-lg">JJ/MM/AAAA</SelectItem>
      </Select>

      {/* Bouton */}
      <Button
        color="primary"
        className="w-full lg:w-auto text-base lg:text-sm font-semibold py-4 lg:py-6 px-10"
      >
        Rechercher
      </Button>
    </div>
  );
}
