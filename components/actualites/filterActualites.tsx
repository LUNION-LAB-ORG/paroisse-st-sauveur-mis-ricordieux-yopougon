"use client";
import {
  Button,
  DatePicker,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@heroui/react";
import { X } from "lucide-react";

interface Props {
  categories: { key: string; label: string }[];
  category: string;
  fromDate: string; // ISO yyyy-mm-dd
  onCategoryChange: (v: string) => void;
  onFromDateChange: (v: string) => void;
  onReset: () => void;
}

function toDateValue(iso: string): DateValue | null {
  if (!iso) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  return new CalendarDate(Number(m[1]), Number(m[2]), Number(m[3]));
}

function toIsoString(d: DateValue | null): string {
  if (!d) return "";
  const y = d.year.toString().padStart(4, "0");
  const m = d.month.toString().padStart(2, "0");
  const day = d.day.toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
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
      {/* Categorie */}
      <Select
        className="w-full md:flex-1"
        selectedKey={category || "all"}
        onSelectionChange={(k) => onCategoryChange(String(k) === "all" ? "" : String(k))}
      >
        <Label>Thématique</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            <ListBox.Item id="all" textValue="Toutes les thématiques">
              Toutes les thématiques
            </ListBox.Item>
            {categories.map((c) => (
              <ListBox.Item key={c.key} id={c.key} textValue={c.label}>
                {c.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Date */}
      <DatePicker
        className="w-full md:flex-1"
        value={toDateValue(fromDate)}
        onChange={(d) => onFromDateChange(toIsoString(d))}
      >
        <Label>Publié à partir du</Label>
      </DatePicker>

      {/* Reset */}
      <Button
        variant="ghost"
        isDisabled={!hasFilter}
        onPress={onReset}
        className="w-full md:w-auto text-sm font-medium"
      >
        <X className="w-4 h-4" /> Réinitialiser
      </Button>
    </div>
  );
}
