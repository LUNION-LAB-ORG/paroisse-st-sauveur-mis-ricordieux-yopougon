"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import {
  Calendar as HeroCalendar,
  Card,
  DatePicker,
  Separator,
} from "@heroui/react";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@heroui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const data = [
  { heure: "06:00 - 07:30", messe: "Messe du matin", icon: "🕯️" },
  { heure: "08:00 - 09:00", messe: "Confession", icon: "✝️" },
  { heure: "10:00 - 11:30", messe: "Messe chantée", icon: "🎵" },
  { heure: "18:00 - 19:30", messe: "Adoration et louange", icon: "🙏" },
];

function toJsDate(v: DateValue): Date {
  return new Date(v.year, v.month - 1, v.day);
}

export default function SelectProgramme() {
  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<DateValue>(
    new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
  );
  const [visibleMonths, setVisibleMonths] = useState<number>(1);

  useEffect(() => {
    const update = () => setVisibleMonths(window.innerWidth >= 1024 ? 2 : 1);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const jsDate = toJsDate(selectedDate);
  const formattedDate = format(jsDate, "dd MMMM yyyy", { locale: fr });
  const dayLabel = format(jsDate, "EEEE d MMMM", { locale: fr });

  return (
    <section className="bg-white w-full px-6 lg:px-[100px] py-12 max-w-[1440px] mx-auto flex flex-col gap-10 items-center">
      {/* Sélecteur de date HeroUI — Card entier = trigger */}
      <DatePicker
        className="w-full max-w-[591px]"
        value={selectedDate}
        onChange={(v) => v && setSelectedDate(v)}
        aria-label="Sélectionner une date"
      >
        <DatePicker.Trigger className="w-full focus:outline-none">
          <Card className="bg-[#2d2d83] text-white p-0 overflow-hidden w-full cursor-pointer hover:bg-[#24246b] transition-colors">
            <Card.Content className="p-5 flex items-center gap-4">
              <CalendarDays className="w-10 h-10 sm:w-12 sm:h-12 text-white/80 shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-xs sm:text-sm font-medium text-white/70">
                  Programme du jour
                </p>
                <p className="text-2xl sm:text-3xl font-semibold capitalize">
                  {formattedDate}
                </p>
              </div>
              <div className="text-white/70 text-sm hidden sm:flex items-center gap-1">
                Changer
                <DatePicker.TriggerIndicator />
              </div>
            </Card.Content>
          </Card>
        </DatePicker.Trigger>

        <DatePicker.Popover
          placement="bottom"
          className={
            visibleMonths === 2
              ? "!min-w-[640px] !max-w-[720px]"
              : "!min-w-[320px]"
          }
        >
          <HeroCalendar
            aria-label="Choisir une date"
            visibleDuration={{ months: visibleMonths }}
            className="p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <HeroCalendar.NavButton slot="previous" />
              <HeroCalendar.Heading className="font-semibold text-[#2d2d83] capitalize" />
              <HeroCalendar.NavButton slot="next" />
            </div>
            <div className={visibleMonths === 2 ? "flex gap-6 justify-center" : ""}>
              <HeroCalendar.Grid>
                <HeroCalendar.GridHeader>
                  {(day) => (
                    <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>
                  )}
                </HeroCalendar.GridHeader>
                <HeroCalendar.GridBody>
                  {(d) => <HeroCalendar.Cell date={d} />}
                </HeroCalendar.GridBody>
              </HeroCalendar.Grid>
              {visibleMonths === 2 && (
                <HeroCalendar.Grid offset={{ months: 1 }}>
                  <HeroCalendar.GridHeader>
                    {(day) => (
                      <HeroCalendar.HeaderCell>{day}</HeroCalendar.HeaderCell>
                    )}
                  </HeroCalendar.GridHeader>
                  <HeroCalendar.GridBody>
                    {(d) => <HeroCalendar.Cell date={d} />}
                  </HeroCalendar.GridBody>
                </HeroCalendar.Grid>
              )}
            </div>
          </HeroCalendar>
        </DatePicker.Popover>
      </DatePicker>

      {/* Titre jour sélectionné */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal italic text-[#2d2d83] text-center">
        Horaires du <span className="first-letter:uppercase">{dayLabel}</span>
      </h2>

      {/* Cartes horaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
        {data.map((item, index) => (
          <Card
            key={index}
            className="border-t-4 border-t-[#98141f] hover:shadow-lg transition-shadow"
          >
            <Card.Content className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#98141f]" />
                <Card.Title className="text-xl sm:text-2xl font-bold text-[#2d2d83]">
                  {item.heure}
                </Card.Title>
              </div>
              <Separator />
              <Card.Description className="text-base sm:text-lg text-foreground">
                {item.messe}
              </Card.Description>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
