"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";

interface Props {
  txt1: string;
  dataContainer: {
    title: string;
    description: string;
    image: string;
    link: string;
  }[];
}

export default function CardContainer({ txt1, dataContainer }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4">
      <h2 className="text-blue-900 text-3xl sm:text-4xl lg:text-5xl font-bold mb-12 lg:mb-20 text-center">
        {txt1}
      </h2>

      <div className="flex flex-col gap-12 lg:flex-row lg:gap-8">
        {dataContainer.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-white rounded-lg shadow-lg overflow-hidden max-w-lg mx-auto lg:max-w-none"
          >
            <div className="relative w-full h-64 sm:h-72 lg:h-80">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority={index === 0} // Prioritize first image loading
              />
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-semibold mb-4 text-blue-900">
                {item.title}
              </h3>
              <p className="text-gray-700 mb-6 max-w-[90%]">{item.description}</p>

              <Link href={item.link} className="mt-auto self-start">
                <Button
                  color="primary"
                  className="text-md lg:text-md py-3 lg:py-4 px-8 rounded-full"
                >
                  Plus d'info
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
