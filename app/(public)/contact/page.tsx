import type { Metadata } from "next";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

import { BandeauPage } from "@/components/site/bandeau-page";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { LIEN_DON } from "@/components/site/navigation";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import {
  carteGoogle,
  CONTENEUR,
  lienTelephone,
  lienWhatsappNumero,
  URL_SITE,
} from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const DESCRIPTION =
  "Adresse, téléphone, e-mail, horaires du secrétariat et plan d’accès de la paroisse Saint Sauveur Miséricordieux à Yopougon Millionnaire (Abidjan).";

export const metadata: Metadata = {
  title: "Contact et plan d’accès",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contacter la paroisse",
    description: DESCRIPTION,
    type: "website",
    locale: "fr_CI",
  },
};

const BOUTON =
  "flex min-h-11 items-center justify-center gap-2.5 rounded-charte px-5 py-3.5 text-center text-[15px] font-bold hover:no-underline";

/** Lien WhatsApp : paramètre social.whatsapp (lien ou numéro), sinon le téléphone. */
function lienWhatsapp(valeur: string, telephone: string): string | null {
  const message = "Bonjour, je souhaite contacter la paroisse.";

  if (/^https?:\/\//.test(valeur)) return valeur;
  if (valeur.replace(/[^\d]/g, "").length >= 8)
    return lienWhatsappNumero(valeur, message);
  if (telephone) return lienWhatsappNumero(telephone, message);

  return null;
}

export default async function PageContact() {
  const settings = await settingServerAPI.obtenirMap();
  const identite = identiteParoisse(settings);
  const horaires = (settings["parish.office_hours"] ?? "").trim();
  const adresse = identite.adresse || "Yopougon Millionnaire, Abidjan";
  const whatsapp = lienWhatsapp(identite.reseaux.whatsapp, identite.telephone);
  const reseaux = [
    { label: "Facebook", href: identite.reseaux.facebook },
    { label: "YouTube", href: identite.reseaux.youtube },
    { label: "Instagram", href: identite.reseaux.instagram },
  ].filter((r) => /^https?:\/\//.test(r.href));

  const liensUtiles = [
    {
      titre: "Demander une messe",
      texte: "Confier une intention à la prière de la communauté.",
      href: "/demande-messe",
    },
    {
      titre: "Rencontrer un prêtre",
      texte: "Confession, accompagnement, préparation aux sacrements.",
      href: "/equipe#rdv",
    },
    {
      titre: "Faire un don",
      texte: "Soutenir la paroisse et la construction de la nouvelle église.",
      href: LIEN_DON,
    },
    {
      titre: "Horaires des messes",
      texte: "Messes, confessions et adoration de la semaine.",
      href: "/horaires",
    },
  ];

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "Church",
          name: identite.nom,
          url: URL_SITE,
          ...(identite.telephone && { telephone: identite.telephone }),
          ...(identite.email && { email: identite.email }),
          address: {
            "@type": "PostalAddress",
            streetAddress: adresse,
            addressLocality: "Abidjan",
            addressCountry: "CI",
          },
          ...(reseaux.length > 0 && { sameAs: reseaux.map((r) => r.href) }),
        }}
      />
      <BandeauPage
        fil={[{ label: "Accueil", href: "/" }, { label: "Contact" }]}
        sousTitre="Le secrétariat paroissial vous accueille, vous renseigne et vous oriente."
        titre="Nous contacter"
      />

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-10 pb-14 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[60px]",
        )}
      >
        <div className="flex min-w-0 flex-col gap-7 lg:col-span-5">
          <address className="flex flex-col gap-5 not-italic">
            <div className="flex gap-3.5">
              <MapPin
                aria-hidden
                className="mt-1 size-5 shrink-0 text-rouge"
                strokeWidth={2}
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-bold text-rouge">
                  Adresse
                </span>
                <span className="text-[17px]">{identite.nom}</span>
                <span className="text-[17px] text-encre-douce">{adresse}</span>
              </div>
            </div>
            {identite.telephone && (
              <div className="flex gap-3.5">
                <Phone
                  aria-hidden
                  className="mt-1 size-5 shrink-0 text-rouge"
                  strokeWidth={2}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-rouge">
                    Téléphone
                  </span>
                  <a
                    className="text-[17px] text-encre hover:text-rouge"
                    href={lienTelephone(identite.telephone)}
                  >
                    {identite.telephone}
                  </a>
                </div>
              </div>
            )}
            {identite.email && (
              <div className="flex gap-3.5">
                <Mail
                  aria-hidden
                  className="mt-1 size-5 shrink-0 text-rouge"
                  strokeWidth={2}
                />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[13px] font-bold text-rouge">
                    E-mail
                  </span>
                  <a
                    className="break-all text-[17px] text-encre hover:text-rouge"
                    href={`mailto:${identite.email}`}
                  >
                    {identite.email}
                  </a>
                </div>
              </div>
            )}
          </address>

          <div className="flex flex-col gap-2 border-t border-marine pt-[18px]">
            <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
              Horaires du secrétariat
            </h2>
            <p className="m-0 whitespace-pre-line text-base leading-[1.6] text-encre-douce">
              {horaires ||
                "Les horaires du secrétariat sont affichés à l’entrée de l’église."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:grid-cols-1 maquette:grid-cols-3">
            {identite.telephone && (
              <a
                className={cn(
                  BOUTON,
                  "bg-rouge text-white hover:bg-rouge-hover hover:text-white",
                )}
                href={lienTelephone(identite.telephone)}
              >
                <Phone aria-hidden className="size-[18px]" strokeWidth={2} />
                Appeler
              </a>
            )}
            {whatsapp && (
              <a
                className={cn(
                  BOUTON,
                  "bg-marine text-white hover:bg-marine-deep hover:text-white",
                )}
                href={whatsapp}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MessageCircle
                  aria-hidden
                  className="size-[18px]"
                  strokeWidth={2}
                />
                WhatsApp
              </a>
            )}
            {identite.email && (
              <a
                className={cn(
                  BOUTON,
                  "border border-marine text-marine hover:text-marine",
                )}
                href={`mailto:${identite.email}`}
              >
                <Mail aria-hidden className="size-[18px]" strokeWidth={2} />
                E-mail
              </a>
            )}
          </div>

          {reseaux.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-marine pt-[18px]">
              <h2 className="m-0 font-heading text-[17px] font-extrabold text-marine">
                Suivre la paroisse
              </h2>
              <ul className="m-0 flex list-none flex-wrap gap-x-6 p-0">
                {reseaux.map((r) => (
                  <li key={r.label}>
                    <a
                      className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
                      href={r.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-3 lg:col-span-7 lg:col-start-6">
          <iframe
            allowFullScreen
            className="h-[300px] w-full border-0 bg-lin lg:h-[520px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={carteGoogle(`${identite.nom}, ${adresse}`)}
            title={`Plan d’accès : ${identite.nom}`}
          />
          <a
            className="flex min-h-11 items-center self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${identite.nom}, ${adresse}`)}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            Ouvrir l’itinéraire dans Google Maps
          </a>
        </div>
      </section>

      <section className="border-t border-ligne bg-white">
        <div className={cn(CONTENEUR, "flex flex-col gap-8 py-14 lg:py-20")}>
          <h2 className="m-0 font-heading text-[26px] font-extrabold leading-[1.1] text-marine lg:text-[34px]">
            Liens utiles
          </h2>
          <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {liensUtiles.map((l) => (
              <li key={l.href}>
                <Link
                  className="flex h-full flex-col gap-2 border-t border-marine pt-4 text-encre hover:text-encre hover:no-underline"
                  href={l.href}
                >
                  <span className="font-heading text-lg font-bold text-marine">
                    {l.titre}
                  </span>
                  <span className="text-[15px] leading-[1.5] text-encre-douce">
                    {l.texte}
                  </span>
                  <span className="mt-auto pt-1 text-[15px] font-bold text-rouge">
                    Accéder
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
