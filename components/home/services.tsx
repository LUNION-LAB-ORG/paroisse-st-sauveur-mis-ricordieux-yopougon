import Link from "next/link";
import { Church, HeartHandshake, CalendarPlus } from "lucide-react";
import { Card } from "@heroui/react";

const data = [
  {
    title: "Demander une Messe",
    description:
      "Faites une demande de messe d'intention ou d'action de grâce.",
    icon: Church,
    btn: "Demander",
    link: "/demande-messe",
  },
  {
    title: "Demander une Écoute",
    description: "Prenez rendez-vous pour un temps d'écoute ou de confession.",
    icon: HeartHandshake,
    btn: "Contacter",
    link: "/ecoute",
  },
  {
    title: "Organiser un Événement",
    description: "Planifiez une activité ou un événement paroissial.",
    icon: CalendarPlus,
    btn: "Organiser",
    link: "/evenement",
  },
];

export default function Services() {
  return (
    <section className="px-6 lg:px-[100px] max-w-[1440px] mx-auto">
      <div className="text-center mb-12">
        <p className="text-[#98141f] text-sm font-semibold uppercase tracking-widest mb-3">
          Nos services
        </p>
        <h2 className="text-[#2d2d83] text-2xl sm:text-3xl lg:text-4xl font-bold">
          Comment pouvons-nous vous aider ?
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <Card
            key={index}
            className="group overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Top accent line */}
            <div className="h-1 bg-gradient-to-r from-[#2d2d83] to-[#98141f]" />

            <Card.Content className="p-6 lg:p-8 flex-1 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#2d2d83]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#2d2d83] group-hover:scale-110 transition-all duration-300">
                <item.icon className="w-7 h-7 text-[#2d2d83] group-hover:text-white transition-colors duration-300" />
              </div>

              <Card.Title className="text-xl font-bold text-[#2d2d83] mb-3">
                {item.title}
              </Card.Title>
              <Card.Description className="text-sm leading-relaxed mb-6 flex-1">
                {item.description}
              </Card.Description>

              <Link
                href={item.link}
                className="block w-full bg-[#98141f] hover:bg-[#7a1019] text-white text-center rounded-xl py-3 text-base font-medium transition-colors"
              >
                {item.btn}
              </Link>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
