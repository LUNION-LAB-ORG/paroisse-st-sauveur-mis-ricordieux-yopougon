"use client";
import Link from "next/link";
import Image from "next/image";
import { CalendarClock, MapPinHouse } from "lucide-react";
import { EvenementType } from "./body-actualites";
import { Button } from "@heroui/button";

interface Props {
  txt1: string;
  dataContainer: EvenementType[];
}

export default function CardContainer({ txt1, dataContainer }: Props) {
  return (
    <section className=" px-4  max-w-7xl mx-auto ">
      <h2 className="text-blue-900 text-2xl sm:text-3xl lg:text-5xl font-bold mb-10 lg:mb-20">
        {txt1}
      </h2>

      <div className="sm:px-4 lg:px-8 flex flex-col gap-12 lg:flex-row lg:gap-8">
        {dataContainer.map((item, index) => {
          return (
            <div key={index} className="flex flex-col ">
              <div className="relative pb-2">
                <Image
                  alt={item.title}
                  className="w-full h-auto object-cover ]"
                  height={300}
                  src={item.image}
                  width={500}
                />
                <p className="bg-white absolute top-0 left-0 m-4 p-4 rounded-lg font-bold text-blue-900 text-xl lg:2xl">
                  22 AVRIL
                </p>
              </div>
              <div className="">
                <h3 className="text-xl font-semibold mb-4 text-blue-800 ">
                  {item.title}
                </h3>
                <div className="pb-2 flex gap-10">
                  {/* heure */}
                  <div className="flex items-center gap-4">
                    <CalendarClock className="w-5 h-5" />
                    <span>{item.heure}</span>
                  </div>
                  {/* lieux */}
                  <div className="flex items-center gap-2">
                    <MapPinHouse className="w-5 h-5" />
                    <span>{item.lieux}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 max-w-[90%]">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="text-blue-500 hover:underline"
                >
                  <Button
                    color="primary"
                    className="text-md lg:text-xl lg:w-full py-4 lg:py-8"
                  >
                    {`Plus d'info`}
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
