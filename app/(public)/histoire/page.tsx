import type { Metadata } from "next";

import Link from "next/link";

import { EmplacementImage } from "@/components/accueil/emplacement-image";
import { BandeauPage } from "@/components/site/bandeau-page";
import { DonneesStructurees } from "@/components/site/donnees-structurees";
import { cureServerAPI } from "@/features/cure/apis/cure.server";
import { histoireServerAPI } from "@/features/histoire/apis/histoire.server";
import { pretreServerAPI } from "@/features/pretre/apis/pretre.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import { CONTENEUR, enParagraphes, URL_SITE } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

const DESCRIPTION =
  "L’histoire de la paroisse Saint Sauveur Miséricordieux à Yopougon Millionnaire : ses grandes étapes, les curés qui l’ont conduite et le mot du curé à la communauté.";

export const metadata: Metadata = {
  title: "Notre histoire et le mot du curé",
  description: DESCRIPTION,
  alternates: { canonical: "/histoire" },
  openGraph: {
    title: "Notre histoire",
    description: DESCRIPTION,
    type: "article",
    locale: "fr_CI",
  },
};

const SURTITRE = "text-sm font-bold text-rouge";
const TITRE_H2 =
  "m-0 font-heading text-[26px] font-extrabold leading-[1.1] text-marine lg:text-[34px]";

const annee = (d?: string | null) => (d ? d.slice(0, 4) : "");

/** « 1998 – 2012 », « Depuis 2021 » (curé en fonction). */
function periode(debut: string, fin: string | null) {
  if (!fin) return `Depuis ${annee(debut)}`;

  return annee(debut) === annee(fin)
    ? annee(debut)
    : `${annee(debut)} – ${annee(fin)}`;
}

export default async function PageHistoire() {
  const [jalons, settings, pretres, cures] = await Promise.all([
    histoireServerAPI.obtenirJalons(),
    settingServerAPI.obtenirMap(),
    pretreServerAPI.obtenirTous(),
    cureServerAPI.obtenirTous(),
  ]);

  const identite = identiteParoisse(settings);
  const recit = enParagraphes(settings["history.full_text"]);
  const cure = pretres.find((p) => /^cur[ée]/i.test(p.function)) ?? null;
  const message = enParagraphes(
    (settings["pastor_word.full_message"] ?? "").trim() ||
      settings["pastor_word.message"],
  );
  const signature =
    (settings["pastor_word.signature"] ?? "").trim() ||
    (cure ? `${cure.fullname}, ${cure.function.toLowerCase()}` : "");
  const portrait = settings["pastor_word.photo"] || cure?.photo || null;

  return (
    <>
      <DonneesStructurees
        donnees={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Notre histoire",
          description: DESCRIPTION,
          url: `${URL_SITE}/histoire`,
          about: { "@type": "Church", name: identite.nom, url: URL_SITE },
        }}
      />
      <BandeauPage
        filigrane
        fil={[
          { label: "Accueil", href: "/" },
          { label: "La paroisse" },
          { label: "Notre histoire" },
        ]}
        sousTitre="Une communauté enracinée à Yopougon Millionnaire, qui grandit dans la foi et bâtit aujourd’hui sa nouvelle église."
        titre="Notre histoire"
      />

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-12 pb-14 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[60px]",
        )}
      >
        <div className="flex flex-col gap-4 lg:col-span-5">
          <span className={SURTITRE}>01 — Les grandes étapes</span>
          <h2 className={TITRE_H2}>De la première communauté à aujourd’hui</h2>
          {jalons.length > 0 ? (
            <ol className="m-0 mt-2.5 flex list-none flex-col p-0">
              {jalons.map((h) => (
                <li
                  key={h.id}
                  className="grid grid-cols-[90px_minmax(0,1fr)] border-t border-ligne py-4 last:border-b lg:grid-cols-[110px_minmax(0,1fr)]"
                >
                  <span className="font-heading text-xl font-semibold text-rouge lg:text-[22px]">
                    {h.year}
                  </span>
                  <span className="text-base lg:text-[17px]">{h.title}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="m-0 text-base text-gris">
              Les grandes étapes de la paroisse seront bientôt publiées.
            </p>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:col-span-6 lg:col-start-7">
          <span className={SURTITRE}>02 — Le récit</span>
          <h2 className={TITRE_H2}>Une paroisse, une famille</h2>
          {recit.length > 0 ? (
            <div className="flex flex-col gap-4 text-[17px] leading-[1.75] text-[#2C2C36] lg:text-lg">
              {recit.map((p, i) => (
                <p key={i} className="m-0 whitespace-pre-line">
                  {p}
                </p>
              ))}
            </div>
          ) : (
            <p className="m-0 text-[17px] leading-[1.7] text-encre-douce">
              {identite.description} Le récit complet de son histoire sera
              bientôt publié ici. Vous avez des souvenirs ou des photos des
              débuts de la communauté ? Le secrétariat paroissial les recueille
              avec joie.
            </p>
          )}
          <Link
            className="flex min-h-11 items-center self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
            href="/nouvelle-eglise"
          >
            Le projet de la nouvelle église
          </Link>
        </div>
      </section>

      {cures.length > 0 && (
        <section
          className="scroll-mt-4 border-t border-ligne bg-parchemin"
          id="cures"
        >
          <div
            className={cn(
              CONTENEUR,
              "flex flex-col gap-8 py-14 lg:gap-10 lg:py-20",
            )}
          >
            <div className="flex max-w-[720px] flex-col gap-4">
              <span className={SURTITRE}>03 — Les curés de la paroisse</span>
              <h2 className={TITRE_H2}>Ceux qui ont conduit la communauté</h2>
            </div>
            <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {cures.map((c) => (
                <li
                  key={c.id}
                  className="flex flex-col overflow-hidden border border-ligne bg-white"
                >
                  <EmplacementImage
                    alt={`Portrait de ${c.fullname}`}
                    className="h-[260px] w-full object-top"
                    libelle="Portrait"
                    src={c.photo || null}
                  />
                  <div className="flex flex-col gap-2 p-5">
                    <span className="text-sm font-bold text-rouge">
                      {periode(c.started_at, c.ended_at)}
                    </span>
                    <h3 className="m-0 font-heading text-lg font-bold leading-tight text-marine">
                      {c.fullname}
                    </h3>
                    {c.description?.trim() && (
                      <p className="m-0 whitespace-pre-line text-[15px] leading-[1.6] text-encre-douce">
                        {c.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {message.length > 0 && (
        <section
          className="scroll-mt-4 border-y border-ligne bg-white"
          id="cure"
        >
          <div
            className={cn(
              CONTENEUR,
              "grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-20",
            )}
          >
            <EmplacementImage
              alt={signature ? `Portrait : ${signature}` : "Portrait du curé"}
              className="h-[340px] w-full sm:h-[420px] lg:col-span-4 lg:h-[520px]"
              libelle="Portrait du curé"
              src={portrait}
            />
            <div className="flex min-w-0 flex-col gap-5 lg:col-span-7 lg:col-start-6">
              <span className={SURTITRE}>
                {cures.length > 0 ? "04" : "03"} — Le mot du curé
              </span>
              <div className="flex flex-col gap-5 font-scripture text-xl leading-[1.55] text-marine lg:text-[23px]">
                {message.map((p, i) => (
                  <p key={i} className="m-0 whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>
              {signature && (
                <span className="border-t border-ligne pt-4 text-base font-semibold">
                  {signature}
                </span>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="rounded-charte bg-marine px-6 py-[15px] text-center text-[15px] font-bold text-white hover:bg-marine-deep hover:text-white hover:no-underline"
                  href="/equipe"
                >
                  Découvrir l’équipe pastorale
                </Link>
                <Link
                  className="rounded-charte border border-marine px-6 py-3.5 text-center text-[15px] font-bold text-marine hover:text-marine hover:no-underline"
                  href="/equipe#rdv"
                >
                  Rencontrer un prêtre
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={cn(CONTENEUR, "flex flex-col gap-6 py-14 lg:py-20")}>
        <h2 className={TITRE_H2}>Continuer la découverte</h2>
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-3">
          {[
            {
              titre: "L’équipe pastorale",
              texte: "Les prêtres, les conseils et les services.",
              href: "/equipe",
            },
            {
              titre: "Mouvements et groupes",
              texte: "Trouver sa place dans la communauté.",
              href: "/vie-paroissiale",
            },
            {
              titre: "Horaires des messes",
              texte: "Messes, confessions et adoration.",
              href: "/horaires",
            },
          ].map((l) => (
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
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
