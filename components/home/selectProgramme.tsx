"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, ChevronUp, Clock } from "lucide-react";
import {
  Button,
  Calendar as HeroCalendar,
  Card,
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
  const [calendarOpen, setCalendarOpen] = useState(false);
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

  const handleSelect = (v: DateValue | null) => {
    if (v) {
      setSelectedDate(v);
      setCalendarOpen(false);
    }
  };

  return (
    <section className="bg-white w-full px-6 lg:px-[100px] py-12 max-w-[1440px] mx-auto flex flex-col gap-10 items-center">
      {/* Sélecteur de date — design original + calendrier inline */}
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
                  <p className="text-sm sm:text-base font-medium text-white/70">
                    Programme du jour
                  </p>
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

        {/* Calendrier inline qui se déploie juste en dessous */}
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
              </Card.Content>
            </Card>
          </div>
        )}
      </div>

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
