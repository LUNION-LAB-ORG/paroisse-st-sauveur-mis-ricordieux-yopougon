"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Users,
  MapPin,
  ArrowRight,
  Flame,
  HeartHandshake,
  Cross,
  Church,
  CalendarClock,
  CalendarHeart,
  type LucideIcon,
} from "lucide-react";
import {
  Button,
  Calendar as HeroCalendar,
  Card,
  Chip,
  Separator,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@heroui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { timeSlotAPI } from "@/features/time-slot/apis/time-slot.api";
import { evenementAPI } from "@/features/evenement/apis/evenement.api";
import type { ITimeSlotType } from "@/features/time-slot/types/time-slot.type";
import type { IEvenement } from "@/features/evenement/types/evenement.type";

function toJsDate(v: DateValue): Date {
  return new Date(v.year, v.month - 1, v.day);
}

function extractTime(value?: string | null): string {
  if (!value) return "";
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);
  const d = new Date(value);
  if (!isNaN(d.getTime()))
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", hour12: false });
  return value;
}

interface TypeMeta {
  label: string
  Icon: LucideIcon
  accent: string
  iconBg: string
  iconColor: string
}

const TYPE_META: Record<ITimeSlotType, TypeMeta> = {
  messe:      { label: "Messe",      Icon: Flame,          accent: "border-t-[#2d2d83]", iconBg: "bg-[#2d2d83]/10", iconColor: "text-[#2d2d83]" },
  ecoute:     { label: "Écoute",     Icon: HeartHandshake, accent: "border-t-[#98141f]", iconBg: "bg-[#98141f]/10", iconColor: "text-[#98141f]" },
  confession: { label: "Confession", Icon: Cross,          accent: "border-t-amber-500", iconBg: "bg-amber-100",    iconColor: "text-amber-600" },
  adoration:  { label: "Adoration",  Icon: Church,         accent: "border-t-indigo-500",iconBg: "bg-indigo-100",   iconColor: "text-indigo-600" },
  autre:      { label: "Autre",      Icon: CalendarClock,  accent: "border-t-gray-400",  iconBg: "bg-gray-100",     iconColor: "text-gray-600" },
};

interface RawSlotOcc {
  source: "slot";
  id: number;
  type: ITimeSlotType | string;
  weekday: number;
  start_time: string;
  end_time: string;
  capacity: number | null;
}

interface ProgramItem {
  source: "slot" | "event";
  id: string;
  type: ITimeSlotType | "event";
  startTime: string; // "HH:MM"
  endTime?: string;
  title: string;
  capacity?: number | null;
  location?: string | null;
  href?: string;
  Icon: LucideIcon;
  accent: string;
  iconBg: string;
  iconColor: string;
}

const EVENT_META = {
  label: "Événement",
  Icon: CalendarHeart,
  accent: "border-t-emerald-500",
  iconBg: "bg-emerald-100",
  iconColor: "text-emerald-600",
};

export default function SelectProgramme() {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<DateValue>(
    new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
  );
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [visibleMonths, setVisibleMonths] = useState<number>(1);

  const [slots, setSlots] = useState<RawSlotOcc[]>([]);
  const [events, setEvents] = useState<IEvenement[]>([]);
  const [loading, setLoading] = useState(true);

  // Responsive 1/2 mois
  useEffect(() => {
    const update = () => setVisibleMonths(window.innerWidth >= 1024 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Charger slots + events une fois
  useEffect(() => {
    const types: ITimeSlotType[] = ["messe", "ecoute", "confession", "adoration"];
    const slotPromises = types.map((t) =>
      timeSlotAPI
        .obtenirDisponibles(t, 4)
        .then((res) => {
          const seen = new Set<number>();
          return (res.data ?? [])
            .filter((occ) => {
              if (seen.has(occ.slot_id)) return false;
              seen.add(occ.slot_id);
              return true;
            })
            .map<RawSlotOcc>((occ) => ({
              source: "slot",
              id: occ.slot_id,
              type: occ.type,
              weekday: new Date(occ.date).getDay(),
              start_time: occ.start_time,
              end_time: occ.end_time,
              capacity: occ.capacity,
            }));
        })
        .catch(() => [] as RawSlotOcc[]),
    );

    Promise.all([
      Promise.all(slotPromises).then((arr) => arr.flat()),
      evenementAPI.obtenirTous().then((res) => res.data ?? []).catch(() => [] as IEvenement[]),
    ]).then(([slotData, eventData]) => {
      // Dédup global slots
      const dedup = new Map<number, RawSlotOcc>();
      for (const s of slotData) if (!dedup.has(s.id)) dedup.set(s.id, s);
      setSlots(Array.from(dedup.values()));
      setEvents(eventData);
      setLoading(false);
    });
  }, []);

  const jsDate = toJsDate(selectedDate);
  const formattedDate = format(jsDate, "dd MMMM yyyy", { locale: fr });
  const dayLabel = format(jsDate, "EEEE d MMMM", { locale: fr });
  const targetIso = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
  const targetWeekday = jsDate.getDay();

  // Combiner slots + events pour la date sélectionnée
  const programItems = useMemo<ProgramItem[]>(() => {
    const items: ProgramItem[] = [];

    // 1) Slots récurrents qui matchent le jour de la semaine
    for (const s of slots) {
      if (s.weekday !== targetWeekday) continue;
      const meta = TYPE_META[(s.type as ITimeSlotType) ?? "autre"];
      items.push({
        source: "slot",
        id: `slot-${s.id}`,
        type: (s.type as ITimeSlotType) ?? "autre",
        startTime: extractTime(s.start_time),
        endTime: extractTime(s.end_time),
        title: meta.label,
        capacity: s.capacity,
        Icon: meta.Icon,
        accent: meta.accent,
        iconBg: meta.iconBg,
        iconColor: meta.iconColor,
      });
    }

    // 2) Events ponctuels sur cette date exacte
    for (const ev of events) {
      if (!ev.date_at) continue;
      const evDate = new Date(ev.date_at);
      const evIso = `${evDate.getFullYear()}-${String(evDate.getMonth() + 1).padStart(2, "0")}-${String(evDate.getDate()).padStart(2, "0")}`;
      if (evIso !== targetIso) continue;

      items.push({
        source: "event",
        id: `event-${ev.id}`,
        type: "event",
        startTime: extractTime(ev.time_at) || "00:00",
        title: ev.title,
        location: ev.location_at ?? null,
        href: `/evenement/${ev.id}`,
        Icon: EVENT_META.Icon,
        accent: EVENT_META.accent,
        iconBg: EVENT_META.iconBg,
        iconColor: EVENT_META.iconColor,
      });
    }

    // Tri chronologique + limite à 4
    items.sort((a, b) => a.startTime.localeCompare(b.startTime));
    return items.slice(0, 4);
  }, [slots, events, targetWeekday, targetIso]);

  const handleSelect = (v: DateValue | null) => {
    if (v) {
      setSelectedDate(v);
      setCalendarOpen(false);
    }
  };

  return (
    <section className="bg-white w-full px-6 lg:px-[100px] py-12 max-w-[1440px] mx-auto flex flex-col gap-10 items-center">
      {/* Sélecteur de date */}
      <div
        className={
          visibleMonths === 2 && calendarOpen
            ? "w-full max-w-[720px] flex flex-col items-center"
            : "w-full max-w-[591px] flex flex-col items-center"
        }
      >
        <Card className="bg-[#2d2d83] text-white p-0 overflow-hidden w-full max-w-[591px]">
          <Card.Content className="p-0">
            <div className="flex items-center">
              <div className="flex items-center gap-4 flex-1 pl-4 py-4">
                <CalendarDays className="w-12 h-12 sm:w-16 sm:h-16 text-white/80" />
                <div className="text-center flex-1">
                  <p className="text-sm sm:text-base font-medium text-white/70">Programme du jour</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold capitalize">
                    {formattedDate}
                  </p>
                </div>
              </div>
              <Button
                variant="primary"
                className="bg-[#98141f] hover:bg-[#7a1019] rounded-none h-full px-8 py-12 self-stretch"
                onPress={() => setCalendarOpen((v) => !v)}
                aria-label={calendarOpen ? "Fermer le calendrier" : "Sélectionner une date"}
                aria-expanded={calendarOpen}
              >
                {calendarOpen ? (
                  <ChevronUp className="w-7 h-7" />
                ) : (
                  <ChevronDown className="w-7 h-7" />
                )}
              </Button>
            </div>
          </Card.Content>
        </Card>

        {calendarOpen && (
          <div className="w-full mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <Card className="w-full bg-white shadow-lg border border-gray-200">
              <Card.Content className="p-4 sm:p-6">
                <HeroCalendar
                  aria-label="Choisir une date"
                  value={selectedDate}
                  onChange={handleSelect}
                  visibleDuration={{ months: visibleMonths }}
                  className="w-full"
                >
                  <div className="flex items-center justify-between w-full mb-4 px-2">
                    <HeroCalendar.NavButton slot="previous" />
                    <HeroCalendar.Heading className="font-semibold text-[#2d2d83] capitalize text-center" />
                    <HeroCalendar.NavButton slot="next" />
                  </div>
                  <div
                    className={
                      visibleMonths === 2
                        ? "flex gap-8 justify-center w-full"
                        : "flex justify-center w-full"
                    }
                  >
                    <HeroCalendar.Grid>
                      <HeroCalendar.GridHeader>
                        {(day) => <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>}
                      </HeroCalendar.GridHeader>
                      <HeroCalendar.GridBody>
                        {(d) => <HeroCalendar.Cell date={d} />}
                      </HeroCalendar.GridBody>
                    </HeroCalendar.Grid>
                    {visibleMonths === 2 && (
                      <HeroCalendar.Grid offset={{ months: 1 }}>
                        <HeroCalendar.GridHeader>
                          {(day) => <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>}
                        </HeroCalendar.GridHeader>
                        <HeroCalendar.GridBody>
                          {(d) => <HeroCalendar.Cell date={d} />}
                        </HeroCalendar.GridBody>
                      </HeroCalendar.Grid>
                    )}
                  </div>
                </HeroCalendar>
              </Card.Content>
            </Card>
          </div>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal italic text-[#2d2d83] text-center">
        Horaires du <span className="first-letter:uppercase">{dayLabel}</span>
      </h2>

      {loading ? (
        <p className="text-gray-400 text-sm py-8">Chargement du programme...</p>
      ) : programItems.length === 0 ? (
        <div className="text-center py-8 px-6 bg-amber-50 rounded-2xl border border-amber-200 max-w-md">
          <p className="text-amber-800 font-medium">Aucun programme prévu ce jour-là.</p>
          <p className="text-amber-700 text-sm mt-1">
            Consultez une autre date ou contactez la paroisse.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
          {programItems.map((item) => {
            const Icon = item.Icon
            const cardContent = (
              <Card
                className={`border-t-4 ${item.accent} hover:shadow-lg transition-shadow h-full`}
              >
                <Card.Content className="p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Card.Title className="text-lg sm:text-xl font-bold text-[#2d2d83] leading-tight">
                        {item.title}
                      </Card.Title>
                      <p className="text-sm text-gray-500 inline-flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                        {item.startTime}
                        {item.endTime ? ` – ${item.endTime}` : ""}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center flex-wrap gap-2 mt-auto">
                    {item.capacity ? (
                      <Chip variant="soft" size="sm" color="default">
                        <Users className="w-3 h-3 mr-1" /> {item.capacity} places
                      </Chip>
                    ) : null}
                    {item.location ? (
                      <Chip variant="soft" size="sm" color="default">
                        <MapPin className="w-3 h-3 mr-1" /> {item.location}
                      </Chip>
                    ) : null}
                    {item.source === "event" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium ml-auto">
                        Voir <ArrowRight className="w-3 h-3" />
                      </span>
                    ) : null}
                  </div>
                </Card.Content>
              </Card>
            )
            return item.href ? (
              <Link key={item.id} href={item.href} className="contents">
                {cardContent}
              </Link>
            ) : (
              <div key={item.id}>{cardContent}</div>
            )
          })}
        </div>
      )}
    </section>
  );
}
