import type { Metadata } from "next";
import type { IEvenement } from "@/features/evenement/types/evenement.type";

import { CalendarPlus, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { InscriptionEvenement } from "@/components/agenda/inscription-evenement";
import { EmplacementImage } from "@/components/accueil/emplacement-image";
import { FilAriane } from "@/components/site/fil-ariane";
import { baseURL } from "@/config/api";
import { agendaServerAPI } from "@/features/evenement/apis/agenda.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import {
  carteGoogle,
  CONTENEUR,
  dateLongue,
  formatMontant,
  heureCourte,
  jourMoisLong,
  lienPartageWhatsapp,
  pastilleDate,
} from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const URL_SITE =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://paroisse-st-sauveur-mis-ricordieux.vercel.app";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const evenement = await agendaServerAPI.obtenir((await params).slug);

  if (!evenement) return { title: "Événement introuvable" };

  return {
    title: evenement.title,
    description: evenement.summary ?? undefined,
    openGraph: {
      title: evenement.title,
      description: evenement.summary ?? undefined,
      images: evenement.image ? [evenement.image] : undefined,
      type: "article",
    },
  };
}

function participation(e: IEvenement): string {
  if (!e.is_paid) return "Libre";
  const tarifs = e.pricing_tiers ?? [];

  if (tarifs.length > 0) {
    const min = Math.min(...tarifs.map((t) => t.amount));

    return `À partir de ${formatMontant(min)} FCFA`;
  }

  return e.price ? `${formatMontant(Number(e.price))} FCFA` : "Payante";
}

export default async function PageEvenement({ params }: Props) {
  const { slug } = await params;
  const [evenement, aVenir, settings] = await Promise.all([
    agendaServerAPI.obtenir(slug),
    agendaServerAPI.obtenirAVenir(6),
    settingServerAPI.obtenirMap(),
  ]);

  if (!evenement) notFound();

  const identite = identiteParoisse(settings);
  const cle = evenement.slug ?? String(evenement.id);
  const pastille = pastilleDate(evenement.date_at);
  const horaire = [
    heureCourte(evenement.time_at),
    heureCourte(evenement.end_time),
  ]
    .filter(Boolean)
    .join(" – ");
  const autres = aVenir.filter((e) => e.id !== evenement.id).slice(0, 3);
  const paragraphes = (evenement.description ?? "")
    .split(/\n\s*\n/)
    .filter((p) => p.trim());
  const texteDePartage = `${evenement.title} — ${dateLongue(evenement.date_at.slice(0, 10))}${horaire ? `, ${horaire}` : ""}\n${URL_SITE}/agenda/${cle}`;

  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: evenement.title,
    description: evenement.summary ?? undefined,
    startDate: `${evenement.date_at.slice(0, 10)}T${heureCourte(evenement.time_at) || "00:00"}:00+00:00`,
    ...(evenement.end_time && {
      endDate: `${evenement.date_at.slice(0, 10)}T${heureCourte(evenement.end_time)}:00+00:00`,
    }),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: evenement.location_at || identite.nom,
      address: identite.adresse || "Yopougon Millionnaire, Abidjan",
    },
    image: evenement.image ? [evenement.image] : undefined,
    organizer: { "@type": "Organization", name: identite.nom, url: URL_SITE },
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(donneesStructurees).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />

      <div className={cn(CONTENEUR, "pt-7")}>
        <FilAriane
          etapes={[
            { label: "Accueil", href: "/" },
            { label: "Agenda", href: "/agenda" },
            { label: evenement.title },
          ]}
        />
      </div>

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-10 pb-16 pt-9 lg:grid-cols-12 lg:gap-x-6 lg:pb-20",
        )}
      >
        <div className="flex flex-col gap-6 lg:col-span-7">
          <span className="text-sm font-bold text-rouge">
            {[evenement.category || "Événement paroissial", evenement.audience]
              .filter(Boolean)
              .join(" · ")}
          </span>
          <h1 className="m-0 font-heading text-[30px] font-extrabold leading-[1.1] tracking-[-0.015em] text-marine lg:text-[44px]">
            {evenement.title}
          </h1>
          {evenement.summary && (
            <p className="m-0 text-lg leading-[1.6] text-encre-douce lg:text-xl">
              {evenement.summary}
            </p>
          )}
          <EmplacementImage
            alt={`Affiche : ${evenement.title}`}
            className="h-[260px] w-full lg:h-[420px]"
            libelle="Affiche ou photo de l’événement"
            src={evenement.image}
          />
          {paragraphes.length > 0 && (
            <div className="flex flex-col gap-4 text-[17px] leading-[1.7] text-[#2C2C36] lg:text-lg">
              {paragraphes.map((p, i) => (
                <p key={i} className="m-0 whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          )}

          {(evenement.programme?.length ?? 0) > 0 && (
            <>
              <h2 className="m-0 mt-4 font-heading text-2xl font-extrabold text-marine">
                Programme
              </h2>
              <ol className="m-0 flex list-none flex-col p-0">
                {evenement.programme!.map((p, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[90px_minmax(0,1fr)] border-t border-ligne py-4 text-[17px] lg:grid-cols-[120px_minmax(0,1fr)]"
                  >
                    <span className="font-bold text-marine">
                      {heureCourte(p.time)}
                    </span>
                    <span>{p.label}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          <h2 className="m-0 mt-4 font-heading text-2xl font-extrabold text-marine">
            Accès
          </h2>
          <iframe
            className="h-60 w-full border-0 bg-lin"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={carteGoogle(
              `${identite.nom}, ${identite.adresse || "Yopougon Millionnaire, Abidjan"}`,
            )}
            title={`Plan d’accès : ${identite.nom}`}
          />
        </div>

        <aside className="flex flex-col gap-5 lg:col-span-4 lg:col-start-9">
          <div className="flex flex-col gap-[18px] bg-marine p-6 text-white lg:p-[30px]">
            <div className="flex items-center gap-[18px]">
              <div className="flex h-[84px] w-[76px] shrink-0 flex-col items-center justify-center bg-white text-marine">
                <span className="font-heading text-[30px] font-extrabold leading-none">
                  {pastille.jour}
                </span>
                <span className="text-[13px] font-bold uppercase">
                  {pastille.mois}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[17px] font-bold">
                  {dateLongue(evenement.date_at.slice(0, 10))}
                </span>
                {horaire && (
                  <span className="text-[15px] text-brume">{horaire}</span>
                )}
              </div>
            </div>
            <dl className="m-0 grid grid-cols-[110px_minmax(0,1fr)] gap-y-2.5 border-t border-marine-line pt-4 text-[15px]">
              <dt className="text-lavande">Lieu</dt>
              <dd className="m-0">{evenement.location_at || "Église"}</dd>
              <dt className="text-lavande">Public</dt>
              <dd className="m-0">
                {evenement.audience || "Toute la communauté"}
              </dd>
              <dt className="text-lavande">Participation</dt>
              <dd className="m-0">{participation(evenement)}</dd>
            </dl>
          </div>

          <InscriptionEvenement evenement={evenement} />

          <div className="flex flex-col gap-2.5">
            <a
              className="flex min-h-11 items-center gap-2.5 rounded-charte border border-ligne bg-white px-4 py-3.5 text-[15px] font-semibold text-encre hover:text-encre hover:no-underline"
              href={`${baseURL.replace(/\/$/, "")}/events/${encodeURIComponent(cle)}/ics`}
            >
              <CalendarPlus
                aria-hidden
                className="size-[18px] text-marine"
                strokeWidth={2}
              />
              Ajouter à mon agenda
            </a>
            <a
              className="flex min-h-11 items-center gap-2.5 rounded-charte border border-ligne bg-white px-4 py-3.5 text-[15px] font-semibold text-encre hover:text-encre hover:no-underline"
              href={lienPartageWhatsapp(texteDePartage)}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Share2
                aria-hidden
                className="size-[18px] text-marine"
                strokeWidth={2}
              />
              Partager sur WhatsApp
            </a>
          </div>
        </aside>
      </section>

      {autres.length > 0 && (
        <section className="border-t border-ligne bg-white">
          <div
            className={cn(CONTENEUR, "flex flex-col gap-6 py-12 lg:py-[70px]")}
          >
            <div className="flex items-end justify-between gap-4">
              <h2 className="m-0 font-heading text-2xl font-extrabold text-marine lg:text-[30px]">
                Autres événements à venir
              </h2>
              <Link
                className="shrink-0 text-[15px] font-bold text-rouge hover:text-rouge-hover"
                href="/agenda"
              >
                Tout l’agenda
              </Link>
            </div>
            <ul className="m-0 list-none p-0">
              {autres.map((e) => (
                <li key={e.id}>
                  <Link
                    className="grid grid-cols-1 gap-1 border-t border-ligne py-[22px] text-encre hover:text-encre hover:no-underline md:grid-cols-[140px_minmax(0,1fr)_200px_120px] md:items-center"
                    href={`/agenda/${e.slug ?? e.id}`}
                  >
                    <span className="font-heading text-lg font-extrabold text-marine">
                      {jourMoisLong(e.date_at)}
                    </span>
                    <span className="text-lg font-semibold lg:text-[19px]">
                      {e.title}
                    </span>
                    <span className="text-[15px] text-gris">
                      {e.location_at}
                    </span>
                    <span className="text-[15px] font-bold text-rouge md:text-right">
                      Détails
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
