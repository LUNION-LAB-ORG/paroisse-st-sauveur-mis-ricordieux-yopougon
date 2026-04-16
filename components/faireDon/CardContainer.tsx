"use client";
import Link from "next/link";
import Image from "next/image";
import { Button, Card } from "@heroui/react";

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
    <section className="w-full">
      <div className="text-center mb-8">
        <p className="text-[#98141f] text-sm font-semibold uppercase tracking-widest mb-2">
          Projets
        </p>
        <h2 className="text-[#2d2d83] text-2xl sm:text-3xl font-bold">
          {txt1}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {dataContainer.map((item, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative w-full h-48">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={index === 0}
              />
            </div>
            <Card.Content className="p-5 flex flex-col flex-grow">
              <Card.Title className="text-base font-bold text-[#2d2d83] mb-2">
                {item.title}
              </Card.Title>
              <Card.Description className="text-sm mb-4 flex-grow">
                {item.description}
              </Card.Description>
              <Button
                variant="primary"
                className="w-full bg-[#98141f] rounded-xl"
                asChild
              >
                <Link href={item.link || "#"}>Soutenir ce projet</Link>
              </Button>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
