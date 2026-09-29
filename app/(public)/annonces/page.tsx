import type { Metadata } from "next";

import { Download } from "lucide-react";
import Link from "next/link";

import { AbonnementCompact } from "@/components/annonces/abonnement-compact";
import { ListeAnnonces } from "@/components/annonces/liste-annonces";
import { BandeauPage } from "@/components/site/bandeau-page";
import { annoncesServerAPI } from "@/features/annonce/apis/annonce.server";
import { agendaServerAPI } from "@/features/evenement/apis/agenda.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import { CONTENEUR, dateDuJour, jourMoisLong } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Annonces paroissiales",
  description:
    "Les annonces de la semaine de la paroisse Saint Sauveur Miséricordieux : sacrements, liturgie, vie paroissiale, chantier.",
};

/** « Semaine du 28 septembre au 4 octobre 2026 » */
function libelleSemaine(aujourdhui: string): string {
  const d = new Date(`${aujourdhui}T00:00:00Z`);
  const lundi = new Date(d);

  lundi.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  const dimanche = new Date(lundi);

  dimanche.setUTCDate(lundi.getUTCDate() + 6);
  const iso = (x: Date) => x.toISOString().slice(0, 10);

  return `Semaine du ${jourMoisLong(iso(lundi))} au ${jourMoisLong(iso(dimanche))} ${dimanche.getUTCFullYear()}`;
}

const TITRE_ASIDE = "font-heading text-[17px] font-extrabold text-marine";

export default async function PageAnnonces() {
  const [annonces, prochains, settings] = await Promise.all([
    annoncesServerAPI.obtenirToutes(),
    agendaServerAPI.obtenirAVenir(1),
    settingServerAPI.obtenirMap(),
  ]);

  const identite = identiteParoisse(settings);
  const pdf = settings["announcements.sheet_pdf"] || null;
  const horaires = settings["parish.office_hours"] || "";
  const aLaUne = annonces.find((a) => a.is_featured) ?? null;
  const autres = annonces.filter((a) => a.id !== aLaUne?.id);
  const prochain = prochains[0] ?? null;

  return (
    <>
      <BandeauPage
        action={
          pdf ? (
            <a
              className="flex min-h-11 shrink-0 items-center gap-2.5 self-start rounded-charte border border-white px-[22px] py-3.5 text-[15px] font-bold text-white hover:bg-white/10 hover:text-white hover:no-underline lg:self-auto"
              href={pdf}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Download aria-hidden className="size-[18px]" strokeWidth={2} />
              Feuille d’annonces (PDF)
            </a>
          ) : null
        }
        fil={[{ label: "Accueil", href: "/" }, { label: "Annonces" }]}
        sousTitre={libelleSemaine(dateDuJour())}
        titre="Annonces paroissiales"
      />

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[50px]",
        )}
      >
        <div className="flex flex-col gap-7 lg:col-span-8">
          {aLaUne && (
            <article
              className="flex scroll-mt-4 flex-col gap-2.5 border border-t-4 border-ligne border-t-rouge bg-white px-6 py-7 lg:px-[30px]"
              id={`annonce-${aLaUne.id}`}
            >
              <span className="text-[13px] font-bold text-rouge">À la une</span>
              <h2 className="m-0 font-heading text-xl font-extrabold text-marine lg:text-2xl">
                {aLaUne.title}
              </h2>
              <p className="m-0 whitespace-pre-line text-base leading-[1.6] text-encre-douce lg:text-[17px]">
                {aLaUne.content}
              </p>
              {aLaUne.contact && (
                <span className="text-[15px] text-gris">
                  Contact : {aLaUne.contact}
                </span>
              )}
              {/chantier|église|eglise|don/i.test(
                `${aLaUne.category} ${aLaUne.title}`,
              ) && (
                <Link
                  className="self-start text-[15px] font-bold text-rouge hover:text-rouge-hover"
                  href="/don"
                >
                  Contribuer en ligne
                </Link>
              )}
            </article>
          )}

          {autres.length > 0 ? (
            <ListeAnnonces annonces={autres} />
          ) : (
            !aLaUne && (
              <p className="m-0 text-base text-gris">
                Aucune annonce n’est publiée cette semaine.
              </p>
            )
          )}
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-3 lg:col-start-10">
          {prochain && (
            <div className="flex flex-col gap-3 border-t border-marine pt-[18px]">
              <span className={TITRE_ASIDE}>Prochain événement</span>
              <span className="text-base leading-[1.45]">{prochain.title}</span>
              <span className="text-sm text-gris">
                {jourMoisLong(prochain.date_at)}
                {prochain.location_at && ` · ${prochain.location_at}`}
              </span>
              <Link
                className="text-[15px] font-bold text-rouge hover:text-rouge-hover"
                href={`/agenda/${prochain.slug ?? prochain.id}`}
              >
                Voir l’événement
              </Link>
            </div>
          )}
          <div className="flex flex-col gap-3 border-t border-marine pt-[18px]">
            <span className={TITRE_ASIDE}>Recevoir les annonces</span>
            <span className="text-[15px] leading-[1.5] text-gris">
              Chaque dimanche, la feuille d’annonces sur WhatsApp.
            </span>
            <AbonnementCompact />
          </div>
          <div className="flex flex-col gap-2 border-t border-marine pt-[18px]">
            <span className={TITRE_ASIDE}>Secrétariat paroissial</span>
            {horaires && (
              <span className="whitespace-pre-line text-[15px] text-encre-douce">
                {horaires}
              </span>
            )}
            {identite.telephone && (
              <a
                className="text-[15px] text-encre-douce hover:text-rouge"
                href={`tel:${identite.telephone.replace(/\s/g, "")}`}
              >
                {identite.telephone}
              </a>
            )}
          </div>
        </aside>
      </section>
    </>
  );
}
