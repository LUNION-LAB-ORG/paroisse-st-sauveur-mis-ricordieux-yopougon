"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Clock, MapPin, CalendarX, ArrowRight } from "lucide-react";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Event } from "@/features/evenement/types/evenement.type";
import { Button, Card, Chip } from "@heroui/react";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Date à venir";
  try {
    return format(parseISO(dateStr), "dd MMM", { locale: fr });
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return "";
  try {
    return format(parseISO(timeStr), "HH'h'mm");
  } catch {
    return timeStr;
  }
}

export default function Evenements({ event = [] }: { event: Event[] }) {
  const dataEvent = event ?? [];
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector<HTMLElement>(":scope > *")?.offsetWidth ?? 300;
    const gap = 24;
    scrollRef.current.scrollBy({
      left: direction === "right" ? cardWidth + gap : -(cardWidth + gap),
      behavior: "smooth",
    });
  };

  if (dataEvent.length === 0) {
    return (
      <section className="px-6 w-full max-w-screen-xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[#98141f] text-sm font-semibold uppercase tracking-widest mb-3">
            Agenda
          </p>
          <h2 className="text-[#2d2d83] text-2xl sm:text-3xl lg:text-4xl font-bold">
            Prochains Événements
          </h2>
        </div>
        {/* Empty state professionnel */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2d2d83]/5 via-white to-[#98141f]/5 border border-[#2d2d83]/10 py-16 px-8 text-center">
          {/* Décoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#2d2d83]/5" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-[#98141f]/5" />

          <div className="relative z-10 flex flex-col items-center gap-5">
            <div className="w-20 h-20 rounded-full bg-[#2d2d83]/10 flex items-center justify-center">
              <CalendarX className="w-10 h-10 text-[#2d2d83]/50" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#2d2d83] mb-2">
                Aucun événement planifié
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto leading-relaxed text-sm">
                La paroisse prépare de nouveaux événements pour vous.
                Revenez bientôt pour découvrir notre prochain programme.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href="/demande-messe"
                className="inline-flex items-center gap-2 bg-[#2d2d83] hover:bg-[#1e1e6b] text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Demander une messe
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ecoute"
                className="inline-flex items-center gap-2 border border-[#2d2d83] text-[#2d2d83] hover:bg-[#2d2d83]/5 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              >
                Demander une écoute
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 w-full max-w-screen-xl mx-auto">
      {/* Header + nav buttons */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#98141f] text-sm font-semibold uppercase tracking-widest mb-3">
            Agenda
          </p>
          <h2 className="text-[#2d2d83] text-2xl sm:text-3xl lg:text-4xl font-bold">
            Prochains Événements
          </h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-10 w-10 p-0 rounded-full border-[#2d2d83] text-[#2d2d83]"
            onPress={() => scroll("left")}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            className="h-10 w-10 p-0 rounded-full border-[#2d2d83] text-[#2d2d83]"
            onPress={() => scroll("right")}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Carousel horizontal */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`[data-events-scroll]::-webkit-scrollbar { display: none; }`}</style>
        {dataEvent.map((item) => (
          <Card
            key={item.id}
            className="overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 snap-start w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
          >
            {/* Image avec badge date */}
            <div className="relative h-[220px] w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/placeholder.jpg";
                }}
              />
              <div className="absolute top-4 left-4">
                <Chip color="accent" variant="primary" className="bg-white text-[#2d2d83] font-bold text-base px-3 py-1">
                  {formatDate(item.date_at)}
                </Chip>
              </div>
            </div>

            <Card.Content className="p-5">
              <Card.Title className="text-[#2d2d83] text-lg font-bold mb-3">
                {item.title}
              </Card.Title>

              <div className="flex flex-wrap gap-4 items-center mb-3 text-sm text-muted">
                {item.time_at && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>{formatTime(item.time_at)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location_at ?? "À préciser"}</span>
                </div>
              </div>

              {item.description && (
                <Card.Description className="text-sm line-clamp-2 mb-4">
                  {item.description}
                </Card.Description>
              )}

              <Button
                variant="primary"
                className="w-full bg-[#98141f] rounded-xl"
              >
                <Link href={`/evenement/${item.id}`}>Plus d&apos;info</Link>
              </Button>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
