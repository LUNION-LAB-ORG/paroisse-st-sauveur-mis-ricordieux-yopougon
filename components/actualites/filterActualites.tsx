import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";

export const animals = [
  { key: "cat", label: "Renovation de clocher" },
  { key: "dog", label: "Renovation de la cher" },
  { key: "elephant", label: "Renovation de clocher" },
  { key: "lion", label: "Lion" },
];

export default function FilterActualites() {
  return (
    <div className="w-full mb-4 flex flex-wrap gap-4">
      <Select
        className="w-full sm:w-1/3  bg-opacity-0"
        label="Renovation de clocher"
        size="lg"
        variant="bordered"
      >
        {animals.map((animal) => (
          <SelectItem key={animal.key} className="text-xl bg-opacity-0">
            {animal.label}
          </SelectItem>
        ))}
      </Select>
      <Select
        className="w-full sm:w-1/3"
        label="jj/mm/aaaa"
        size="lg"
        variant="bordered"
      >
        <SelectItem className="text-xl">jj/mm/aaaa</SelectItem>
      </Select>

      <Button className="text-md lg:text-xl px-16 py-8 lg:py-8" color="primary">
        {`Plus d'info`}
      </Button>
    </div>
  );
}
