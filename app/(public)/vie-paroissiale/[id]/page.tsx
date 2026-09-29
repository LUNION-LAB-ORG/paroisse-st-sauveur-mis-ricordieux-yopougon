import type { Metadata } from "next";

import Link from "next/link";
import { notFound } from "next/navigation";

import { EmplacementImage } from "@/components/accueil/emplacement-image";
import {
  BoutonsMouvement,
  InfosMouvement,
  surtitreMouvement,
} from "@/components/mouvements/infos-mouvement";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { FilAriane } from "@/components/site/fil-ariane";
import { serviceServerAPI } from "@/features/service/apis/service.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import { CONTENEUR, enParagraphes, URL_SITE } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await serviceServerAPI.obtenir((await params).id);

  if (!m) return { title: "Mouvement introuvable" };

  return {
    title: `${m.title} — Mouvements et groupes`,
    description: m.description,
    alternates: { canonical: `/vie-paroissiale/${m.id}` },
    openGraph: {
      title: m.title,
      description: m.description,
      images: m.image ? [m.image] : undefined,
      type: "website",
      locale: "fr_CI",
    },
  };
}

export default async function PageMouvement({ params }: Props) {
  const { id } = await params;
  const [mouvement, tous, settings] = await Promise.all([
    serviceServerAPI.obtenir(id),
    serviceServerAPI.obtenirMouvements(),
    settingServerAPI.obtenirMap(),
  ]);

  if (!mouvement) notFound();

  const identite = identiteParoisse(settings);
  const texte = enParagraphes(mouvement.content);
  // Autres mouvements : d'abord ceux de la même catégorie
  const autres = [
    ...tous.filter(
      (m) => m.id !== mouvement.id && m.category === mouvement.category,
    ),
    ...tous.filter(
      (m) => m.id !== mouvement.id && m.category !== mouvement.category,
    ),
  ].slice(0, 4);

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: mouvement.title,
          description: mouvement.description,
          url: `${URL_SITE}/vie-paroissiale/${mouvement.id}`,
          ...(mouvement.image && { image: mouvement.image }),
          parentOrganization: {
            "@type": "Church",
            name: identite.nom,
            url: URL_SITE,
          },
        }}
      />

      <div className={cn(CONTENEUR, "pt-7")}>
        <FilAriane
          etapes={[
            { label: "Accueil", href: "/" },
            { label: "Vie paroissiale", href: "/vie-paroissiale" },
            { label: mouvement.title },
          ]}
        />
      </div>

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-8 pb-16 pt-8 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-10",
        )}
      >
        <EmplacementImage
          alt={`Photo du groupe ${mouvement.title}`}
          className="h-[240px] w-full sm:h-[360px] lg:col-span-5 lg:h-[520px]"
          libelle="Photo du groupe"
          src={mouvement.image}
        />
        <div className="flex min-w-0 flex-col gap-5 lg:col-span-6 lg:col-start-7">
          {surtitreMouvement(mouvement) && (
            <span className="text-sm font-bold text-rouge">
              {surtitreMouvement(mouvement)}
            </span>
          )}
          <h1 className="m-0 break-words font-heading text-[30px] font-extrabold leading-[1.1] tracking-[-0.015em] text-marine lg:text-[44px]">
            {mouvement.title}
          </h1>
          {mouvement.description && (
            <p className="m-0 text-lg leading-[1.6] text-encre-douce lg:text-xl">
              {mouvement.description}
            </p>
          )}
          {texte.length > 0 && (
            <div className="flex flex-col gap-4 text-[17px] leading-[1.7] text-[#2C2C36]">
              {texte.map((p, i) => (
                <p key={i} className="m-0 whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          )}
          <InfosMouvement className="mt-2" mouvement={mouvement} />
          <BoutonsMouvement mouvement={mouvement} />
          {!mouvement.whatsapp && (
            <p className="m-0 text-sm leading-[1.5] text-gris">
              Le secrétariat paroissial vous met en relation avec le responsable
              {identite.telephone ? ` (${identite.telephone})` : ""}.
            </p>
          )}
        </div>
      </section>

      {autres.length > 0 && (
        <section className="border-t border-ligne bg-white">
          <div
            className={cn(CONTENEUR, "flex flex-col gap-6 py-12 lg:py-[70px]")}
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="m-0 font-heading text-2xl font-extrabold text-marine lg:text-[30px]">
                Autres mouvements
              </h2>
              <Link
                className="flex min-h-11 items-center text-[15px] font-bold text-rouge hover:text-rouge-hover"
                href="/vie-paroissiale"
              >
                Tous les mouvements et groupes
              </Link>
            </div>
            <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
              {autres.map((m) => (
                <li key={m.id} className="min-w-0">
                  <Link
                    className="flex h-full flex-col gap-2 border-t border-marine pt-4 text-encre hover:text-encre hover:no-underline"
                    href={`/vie-paroissiale/${m.id}`}
                  >
                    <span className="text-[13px] font-bold text-rouge">
                      {m.category}
                    </span>
                    <span className="break-words font-heading text-lg font-bold leading-[1.25] text-marine lg:text-xl">
                      {m.title}
                    </span>
                    <span className="line-clamp-3 text-[15px] leading-[1.5] text-encre-douce">
                      {m.description}
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
