"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Eye, Calendar, X } from "lucide-react";
import { mediationAPI } from "@/features/mediation/apis/mediation.api";
import type { IMediation } from "@/features/mediation/types/mediation.type";
import {
  Button,
  Calendar as HeroCalendar,
  DateField,
  DatePicker,
  Label,
  ListBox,
  Select,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@heroui/react";

function normalizeCategory(cat?: string | null): string {
  if (!cat) return "";
  return cat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
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

function shareWhatsApp(title: string, id: number) {
  const url = `${window.location.origin}/meditations/${id}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`, "_blank");
}

function shareFacebook(id: number) {
  const url = `${window.location.origin}/meditations/${id}`;
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
}

export default function CardMeditation() {
  const [mediations, setMediations] = useState<IMediation[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("");
  const [fromDate, setFromDate] = useState<string>("");

  useEffect(() => {
    mediationAPI
      .obtenirTous({ status: "published" })
      .then((res) => setMediations(res.data ?? []))
      .catch(() => setMediations([]))
      .finally(() => setLoading(false));
  }, []);

  // Catégories dynamiques depuis les méditations réelles
  const categories = useMemo(() => {
    const set = new Map<string, string>();
    for (const m of mediations) {
      const label = (m.category ?? "").trim();
      if (!label) continue;
      const key = normalizeCategory(label);
      if (!set.has(key)) set.set(key, label);
    }
    return Array.from(set.entries()).map(([key, label]) => ({ key, label }));
  }, [mediations]);

  const filtered = useMemo(() => {
    return mediations.filter((m) => {
      if (category && normalizeCategory(m.category) !== category) return false;
      if (fromDate) {
        const pub = m.date_at ?? m.created_at;
        if (!pub) return false;
        const d = new Date(pub);
        if (isNaN(d.getTime())) return false;
        const pubDay = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if (pubDay < fromDate) return false;
      }
      return true;
    });
  }, [mediations, category, fromDate]);

  const hasFilter = Boolean(category || fromDate);

  return (
    <section className="py-16 bg-slate-50">
      <div className="px-4 max-w-7xl mx-auto">
        <h2 className="text-blue-900 text-center text-3xl lg:text-5xl font-bold mb-4">
          Méditations & Réflexions
        </h2>
        <p className="mb-10 text-center max-w-3xl mx-auto text-lg lg:text-xl text-muted-foreground">
          Nourrissez votre foi au quotidien avec nos méditations et réflexions spirituelles partagées
          par la communauté.
        </p>

        {/* Filtres HeroUI */}
        <div className="flex flex-col md:flex-row gap-4 md:items-end mb-10 max-w-4xl mx-auto">
          <Select
            className="w-full md:flex-1"
            selectedKey={category || "all"}
            onSelectionChange={(k) => setCategory(String(k) === "all" ? "" : String(k))}
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

          <DatePicker
            className="w-full md:flex-1"
            value={toDateValue(fromDate)}
            onChange={(d) => setFromDate(toIsoString(d))}
            aria-label="Publiée à partir du"
          >
            <Label>Publiée à partir du</Label>
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
              <HeroCalendar aria-label="Date">
                <HeroCalendar.Header>
                  <HeroCalendar.YearPickerTrigger>
                    <HeroCalendar.YearPickerTriggerHeading />
                    <HeroCalendar.YearPickerTriggerIndicator />
                  </HeroCalendar.YearPickerTrigger>
                  <HeroCalendar.NavButton slot="previous" />
                  <HeroCalendar.NavButton slot="next" />
                </HeroCalendar.Header>
                <HeroCalendar.Grid>
                  <HeroCalendar.GridHeader>
                    {(day) => <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>}
                  </HeroCalendar.GridHeader>
                  <HeroCalendar.GridBody>
                    {(date) => <HeroCalendar.Cell date={date} />}
                  </HeroCalendar.GridBody>
                </HeroCalendar.Grid>
                <HeroCalendar.YearPickerGrid>
                  <HeroCalendar.YearPickerGridBody>
                    {({ year }) => <HeroCalendar.YearPickerCell year={year} />}
                  </HeroCalendar.YearPickerGridBody>
                </HeroCalendar.YearPickerGrid>
              </HeroCalendar>
            </DatePicker.Popover>
          </DatePicker>

          <Button
            variant="ghost"
            isDisabled={!hasFilter}
            onPress={() => {
              setCategory("");
              setFromDate("");
            }}
            className="w-full md:w-auto text-sm font-medium"
          >
            <X className="w-4 h-4" /> Réinitialiser
          </Button>
        </div>

        {loading && <div className="text-center py-16 text-gray-400">Chargement...</div>}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            Aucune méditation ne correspond aux filtres.
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
              >
                {/* Image HD ou fallback gradient */}
                <div className="relative w-full aspect-[16/10] bg-gradient-to-br from-[#2d2d83] to-[#2d2d83]/70">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-14 h-14 text-white/80" />
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 self-start">
                    {item.category}
                  </span>

                  <h3 className="text-lg font-bold text-[#2d2d83] mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.date_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {item.views ?? 0}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-4">Par {item.author}</p>

                  <div className="mt-auto flex items-center justify-between gap-2">
                    <Link
                      href={`/meditations/${item.id}`}
                      className="flex-1 text-center bg-[#2d2d83] hover:bg-[#2d2d83]/80 text-white text-sm font-medium py-2 rounded-lg transition-colors"
                    >
                      Lire
                    </Link>

                    <div className="flex gap-1">
                      <button
                        onClick={() => shareWhatsApp(item.title, item.id)}
                        title="Partager sur WhatsApp"
                        className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-green-600">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => shareFacebook(item.id)}
                        title="Partager sur Facebook"
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-blue-600">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
