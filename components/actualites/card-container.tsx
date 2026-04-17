"use client";
import { NewsItemType } from "@/features/actualite/types/actualite.type";
import { Button } from "@heroui/react";
import { CalendarClock, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  txt1: string;
  dataContainer: NewsItemType[];
}

const FALLBACK_IMG = "/assets/images/evenement.jpg";

function formatFR(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatShort(iso?: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function CardContainer({ txt1, dataContainer }: Props) {
  return (
    <section className="px-4 max-w-7xl mx-auto ">
      {txt1 ? (
        <h2 className="text-blue-900 text-center text-3xl sm:text-4xl lg:text-5xl font-bold mb-16">
          {txt1}
        </h2>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 ">
        {dataContainer.map((item, index) => {
          const imgSrc = item.image && item.image !== "null" ? item.image : FALLBACK_IMG;
          const displayDate = item.published_at ?? item.created_at;
          return (
            <div
              key={item.id ?? index}
              className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden"
            >
              {/* Image & date tag */}
              <div className="relative">
                <Image
                  src={imgSrc}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4 bg-white rounded-lg px-4 py-2 shadow text-blue-900 font-bold text-sm uppercase">
                  {formatShort(displayDate)}
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between h-full px-6 py-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-800 mb-4">{item.title}</h3>

                  <div className="flex items-center flex-wrap text-gray-600 gap-x-6 gap-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarClock className="w-4 h-4" />
                      <span>{formatFR(displayDate)}</span>
                    </div>
                    {item.location ? (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                    ) : null}
                  </div>

                  {item.new_resume ? (
                    <p className="text-gray-700 text-base leading-relaxed mb-6">{item.new_resume}</p>
                  ) : null}
                </div>

                <Link href={`/actualites/${item.id}`}>
                  <Button variant="primary" className="w-full text-base py-4 font-semibold">
                    Plus d&apos;info
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
