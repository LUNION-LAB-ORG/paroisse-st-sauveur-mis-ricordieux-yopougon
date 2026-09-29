import type { IService } from "@/features/service/types/service.type";

import Link from "next/link";

import { lienWhatsappNumero } from "@/lib/charte";
import { cn } from "@/lib/utils";

/** Rencontres, lieu, responsable, contact : bandeau de la fiche d'un mouvement. */
export function InfosMouvement({
  mouvement,
  className,
}: {
  mouvement: IService;
  className?: string;
}) {
  const infos = [
    { label: "Rencontres", valeur: mouvement.schedule },
    { label: "Lieu", valeur: mouvement.location },
    { label: "Responsable", valeur: mouvement.leader },
    { label: "Contact", valeur: mouvement.whatsapp },
  ];

  return (
    <dl
      className={cn(
        "m-0 grid grid-cols-2 border-y border-ligne lg:grid-cols-4",
        className,
      )}
    >
      {infos.map((info, i) => (
        <div
          key={info.label}
          className={cn(
            "flex min-w-0 flex-col gap-1 p-4",
            i % 2 === 0 ? "pl-0" : "",
            "lg:pl-4",
            i === 0 && "lg:pl-0",
            i < infos.length - 1 && "lg:border-r lg:border-ligne",
          )}
        >
          <dt className="text-[13px] text-gris">{info.label}</dt>
          <dd className="m-0 break-words text-[15px] font-semibold">
            {info.valeur || "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** « Rejoindre ce groupe » / « Contacter le responsable » par WhatsApp. */
export function BoutonsMouvement({
  mouvement,
  className,
}: {
  mouvement: IService;
  className?: string;
}) {
  if (!mouvement.whatsapp) {
    return (
      <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
        <Link
          className="rounded-charte bg-rouge px-6 py-[15px] text-center text-[15px] font-bold text-white hover:bg-rouge-hover hover:text-white hover:no-underline"
          href="/contact"
        >
          Contacter le secrétariat
        </Link>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <a
        className="rounded-charte bg-rouge px-6 py-[15px] text-center text-[15px] font-bold text-white hover:bg-rouge-hover hover:text-white hover:no-underline"
        href={lienWhatsappNumero(
          mouvement.whatsapp,
          `Bonjour, je souhaite rejoindre le groupe « ${mouvement.title} » de la paroisse.`,
        )}
        rel="noopener noreferrer"
        target="_blank"
      >
        Rejoindre ce groupe
      </a>
      <a
        className="rounded-charte border border-marine px-6 py-3.5 text-center text-[15px] font-bold text-marine hover:text-marine hover:no-underline"
        href={lienWhatsappNumero(
          mouvement.whatsapp,
          `Bonjour, j’aimerais avoir des informations sur le groupe « ${mouvement.title} ».`,
        )}
        rel="noopener noreferrer"
        target="_blank"
      >
        Contacter le responsable
      </a>
    </div>
  );
}

/** Surtitre « Liturgie · Jeunes et adultes ». */
export const surtitreMouvement = (m: IService) =>
  [m.category, m.audience].filter(Boolean).join(" · ");
