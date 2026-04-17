"use client";
import { Button } from "@heroui/react";

interface Props {
  categories: { key: string; label: string }[];
  category: string;
  fromDate: string;
  onCategoryChange: (v: string) => void;
  onFromDateChange: (v: string) => void;
  onReset: () => void;
}

export default function FilterActualites({
  categories,
  category,
  fromDate,
  onCategoryChange,
  onFromDateChange,
  onReset,
}: Props) {
  const hasFilter = Boolean(category || fromDate);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 md:items-end">
      {/* Catégorie */}
      <div className="w-full md:flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Choisir une thématique</label>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/30"
        >
          <option value="">Toutes les thématiques</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Date (à partir de) */}
      <div className="w-full md:flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Publié à partir du</label>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => onFromDateChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d2d83]/30"
        />
      </div>

      {/* Reset */}
      <Button
        variant="ghost"
        isDisabled={!hasFilter}
        onPress={onReset}
        className="w-full md:w-auto text-sm font-medium"
      >
        Réinitialiser
      </Button>
    </div>
  );
}
