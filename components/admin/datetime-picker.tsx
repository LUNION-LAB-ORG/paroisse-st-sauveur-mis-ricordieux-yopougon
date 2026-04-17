"use client";

import {
  Calendar,
  DateField,
  DatePicker,
  Description,
  Label,
  TimeField,
} from "@heroui/react";
import { CalendarDate, Time, getLocalTimeZone, today } from "@internationalized/date";
import type { DateValue, TimeValue } from "@heroui/react";

export interface DateTimePickerProps {
  label: string;
  /** ISO string "YYYY-MM-DDTHH:mm" ou "" */
  value: string;
  onChange: (isoLocal: string) => void;
  helper?: string;
  disableBeforeToday?: boolean;
  isInvalid?: boolean;
  error?: string;
}

function parseIsoLocal(iso: string): { date: DateValue | null; time: TimeValue | null } {
  if (!iso) return { date: null, time: null };
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{1,2}):(\d{2}))?/);
  if (!match) return { date: null, time: null };
  const [, y, m, d, h, min] = match;
  return {
    date: new CalendarDate(Number(y), Number(m), Number(d)),
    time: h != null ? new Time(Number(h), Number(min ?? "0")) : null,
  };
}

function combine(date: DateValue | null, time: TimeValue | null): string {
  if (!date) return "";
  const y = date.year;
  const mo = String(date.month).padStart(2, "0");
  const d = String(date.day).padStart(2, "0");
  const h = String(time?.hour ?? 0).padStart(2, "0");
  const mi = String(time?.minute ?? 0).padStart(2, "0");
  return `${y}-${mo}-${d}T${h}:${mi}`;
}

export function DateTimePicker({
  label,
  value,
  onChange,
  helper,
  disableBeforeToday = false,
  isInvalid,
  error,
}: DateTimePickerProps) {
  const { date, time } = parseIsoLocal(value);

  const onDate = (d: DateValue | null) => onChange(combine(d, time));
  const onTime = (t: TimeValue | null) => onChange(combine(date, t));

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-2 gap-3">
        <DatePicker
          className="w-full"
          value={date}
          onChange={onDate}
          minValue={disableBeforeToday ? today(getLocalTimeZone()) : undefined}
          isInvalid={isInvalid}
          aria-label={`${label} - date`}
        >
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
            <Calendar aria-label={`${label} - calendrier`}>
              <Calendar.Header>
                <Calendar.NavButton slot="previous" />
                <Calendar.Heading />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(d) => <Calendar.Cell date={d} />}
                </Calendar.GridBody>
              </Calendar.Grid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>

        <TimeField
          className="w-full"
          value={time}
          onChange={onTime}
          isInvalid={isInvalid}
          aria-label={`${label} - heure`}
        >
          <TimeField.Group>
            <TimeField.Input>
              {(segment) => <TimeField.Segment segment={segment} />}
            </TimeField.Input>
          </TimeField.Group>
        </TimeField>
      </div>
      {error && <Description className="text-red-500 text-xs">{error}</Description>}
      {!error && helper && (
        <Description className="text-xs text-gray-500">{helper}</Description>
      )}
    </div>
  );
}
