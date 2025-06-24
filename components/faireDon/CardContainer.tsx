"use client";
import Link from "next/link";
// import { Button } from "../ui/button";
import Image from "next/image";
import { CalendarClock, MapPinHouse } from "lucide-react";
import { ProjetEnCour } from "@/app/faire-don/content";
import { Button } from "@heroui/button";

interface Props {
  txt1: string;
  dataContainer: ProjetEnCour[];
}

export default function CardContainer({ txt1, dataContainer }: Props) {
  return (
    <section>
      <h2 className="text-blue-900 text-2xl sm:text-3xl lg:text-5xl font-bold mb-10 lg:mb-20">
        {txt1}
      </h2>

      <div className="sm:px-4 lg:px-8 flex flex-col gap-12 lg:flex-row lg:gap-8">
        {dataContainer.map((item, index) => {
          return (
            <div key={index} className="flex flex-col ">
              <div className="relative pb-2">
                <Image
                  className="w-full h-auto max-h-[300px] object-cover ]"
                  src={item.image}
                  alt={item.title}
                  width={2732}
                  height={4096}
                />
              </div>
              <div className="">
                <h3 className="text-xl font-semibold mb-4 text-blue-800 ">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 max-w-[90%]">
                  {item.description}
                </p>
                <Link
                  href={item.link}
                  className="text-blue-500 hover:underline"
                >
                  <Button  className="text-md lg:text-xl lg:w-full py-4 lg:py-8" color="primary">
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
