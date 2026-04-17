"use client";
import {
  Button,
  Calendar,
  DateField,
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
      {/* Catégorie */}
      <Select
        className="w-full md:flex-1"
        selectedKey={category || "all"}
        onSelectionChange={(k) => onCategoryChange(String(k) === "all" ? "" : String(k))}
        aria-label="Filtrer par thématique"
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

      {/* Date picker compound complet */}
      <DatePicker
        className="w-full md:flex-1"
        value={toDateValue(fromDate)}
        onChange={(d) => onFromDateChange(toIsoString(d))}
        aria-label="Date de début"
      >
        <Label>Publié à partir du</Label>
        <DateField.Group fullWidth>
          <DateField.Input>
            {(segment) => <DateField.Segment segment={segment} />}
          </DateField.Input>
          <DateField.Suffix>
            <DatePicker.Trigger>
              <DatePicker.TriggerIndicator />
            </DatePicker.Trigger>
          </DateField.Suffix>
        </DateField.Group>
        <DatePicker.Popover>
          <Calendar aria-label="Date">
            <Calendar.Header>
              <Calendar.YearPickerTrigger>
                <Calendar.YearPickerTriggerHeading />
                <Calendar.YearPickerTriggerIndicator />
              </Calendar.YearPickerTrigger>
              <Calendar.NavButton slot="previous" />
              <Calendar.NavButton slot="next" />
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
            </Calendar.Grid>
            <Calendar.YearPickerGrid>
              <Calendar.YearPickerGridBody>
                {({ year }) => <Calendar.YearPickerCell year={year} />}
              </Calendar.YearPickerGridBody>
            </Calendar.YearPickerGrid>
          </Calendar>
        </DatePicker.Popover>
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
