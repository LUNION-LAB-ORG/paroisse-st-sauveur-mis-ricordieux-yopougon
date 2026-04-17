"use client";

import { useState, useRef } from "react";
import { CalendarDays, ChevronDown, Clock } from "lucide-react";
import { Button, Card, Separator } from "@heroui/react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const data = [
  { heure: "06:00 - 07:30", messe: "Messe du matin", icon: "🕯️" },
  { heure: "08:00 - 09:00", messe: "Confession", icon: "✝️" },
  { heure: "10:00 - 11:30", messe: "Messe chantée", icon: "🎵" },
  { heure: "18:00 - 19:30", messe: "Adoration et louange", icon: "🙏" },
];

function toDateInputValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function SelectProgramme() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);

  const formattedDate = format(selectedDate, "dd MMMM yyyy", { locale: fr });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [y, m, d] = e.target.value.split("-").map(Number);
      setSelectedDate(new Date(y, m - 1, d));
    }
  };

  return (
    <section className="bg-white w-full px-6 lg:px-[100px] py-12 max-w-[1440px] mx-auto flex flex-col gap-10 items-center">
      {/* Selecteur de date */}
      <div className="relative w-full max-w-[591px]">
        {/* Input date caché */}
        <input
          ref={dateInputRef}
          type="date"
          value={toDateInputValue(selectedDate)}
          onChange={handleDateChange}
          className="absolute opacity-0 w-0 h-0 pointer-events-none"
          tabIndex={-1}
        />
        <Card className="bg-[#2d2d83] text-white p-0 overflow-hidden w-full">
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
                onPress={() => dateInputRef.current?.showPicker?.()}
                aria-label="Sélectionner une date"
              >
                <ChevronDown className="w-7 h-7" />
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Titre */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal italic text-[#2d2d83] text-center">
        Horaires du{" "}
        {format(selectedDate, "EEEE d MMMM", { locale: fr })}
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
