import type { IIdentiteParoisse } from "@/features/setting/utils/identite";

import Link from "next/link";

import { LIEN_DON } from "./navigation";

import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

const COLONNES = [
  {
    titre: "La paroisse",
    liens: [
      { label: "Histoire", href: "/histoire" },
      { label: "Le mot du curé", href: "/histoire#cure" },
      { label: "Horaires", href: "/horaires" },
      { label: "Annonces", href: "/annonces" },
      { label: "Équipe pastorale", href: "/equipe" },
      { label: "Méditations", href: "/meditations" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    titre: "Participer",
    liens: [
      { label: "Mouvements", href: "/vie-paroissiale" },
      { label: "Parole du jour", href: "/parole-du-jour" },
      { label: "Agenda", href: "/agenda" },
      { label: "Communauté", href: "/communaute" },
      { label: "Actualités", href: "/actualites" },
      { label: "Nouvelle église", href: "/nouvelle-eglise" },
      { label: "Demander une messe", href: "/demande-messe" },
      { label: "Faire un don", href: LIEN_DON },
    ],
  },
] as const;

export function SiteFooter({ identite }: { identite: IIdentiteParoisse }) {
  const { nom, devise, diocese, adresse, telephone, email, logo } = identite;

  return (
    <>
      <div
        aria-hidden
        className="filet-marque mt-8 h-[3px] lg:mt-[100px] lg:h-1"
      />
      <footer
        className="bg-marine-deep text-sm text-pied lg:text-[15px]"
        id="contact"
      >
        <div
          className={cn(
            CONTENEUR,
            "flex flex-col gap-10 py-[30px] lg:gap-[50px] lg:pb-10 lg:pt-[70px]",
          )}
        >
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-x-6">
            <div className="flex flex-col gap-2.5 lg:col-span-4 lg:gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={`Logo de la ${nom}`}
                className="size-[84px] rounded-full border-[3px] border-white object-cover lg:size-[110px]"
                src={logo}
              />
              <span className="font-heading text-sm font-extrabold uppercase leading-[1.3] text-white lg:text-lg">
                {nom}
              </span>
              <span className="leading-[1.6]">
                {devise} · {diocese}
              </span>
            </div>

            {COLONNES.map((col, i) => (
              <div
                key={col.titre}
                className={cn(
                  "hidden flex-col gap-2.5 lg:col-span-2 lg:flex",
                  i === 0 && "lg:col-start-6",
                )}
              >
                <span className="font-bold text-white">{col.titre}</span>
                {col.liens.map((l) => (
                  <Link
                    key={l.label}
                    className="text-pied hover:text-white"
                    href={l.href}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>
            ))}

            <div className="flex flex-col gap-2.5 lg:col-span-3">
              <span className="hidden font-bold text-white lg:block">
                Contact
              </span>
              {adresse && <span>{adresse}</span>}
              {telephone && (
                <a
                  className="text-pied hover:text-white"
                  href={`tel:${telephone.replace(/\s/g, "")}`}
                >
                  {telephone}
                </a>
              )}
              {email && (
                <a
                  className="break-all text-pied hover:text-white"
                  href={`mailto:${email}`}
                >
                  {email}
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-marine-soft pt-[22px] text-xs text-pied-note sm:flex-row sm:justify-between lg:text-[13px]">
            <span>
              © {new Date().getFullYear()} {nom}
            </span>
            <span className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <Link
                className="inline-flex min-h-11 items-center text-pied-note underline underline-offset-2 hover:text-white sm:min-h-0"
                href="/confidentialite"
              >
                Confidentialité et données personnelles
              </Link>
              <span>Textes liturgiques : AELF</span>
              <span>Développé par Lunion-Lab</span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
