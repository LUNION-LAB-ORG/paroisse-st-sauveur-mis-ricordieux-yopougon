import type { Metadata } from "next";

import Link from "next/link";

import { EmplacementImage } from "@/components/accueil/emplacement-image";
import { FormulaireRendezVous } from "@/components/equipe-pastorale/formulaire-rendez-vous";
import { Vicaires } from "@/components/equipe-pastorale/vicaires";
import { BandeauPage } from "@/components/site/bandeau-page";
import { conseilServerAPI } from "@/features/conseil/apis/conseil.server";
import { pretreServerAPI } from "@/features/pretre/apis/pretre.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { CONTENEUR } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "L’équipe pastorale",
  description:
    "Les prêtres, les conseils et les services qui font vivre au quotidien la paroisse Saint Sauveur Miséricordieux.",
};

const SURTITRE = "text-sm font-bold text-rouge";
const TITRE_H2 =
  "m-0 font-heading text-[26px] font-extrabold leading-[1.1] text-marine lg:text-[34px]";

export default async function PageEquipe() {
  const [pretres, conseils, settings] = await Promise.all([
    pretreServerAPI.obtenirTous(),
    conseilServerAPI.obtenirTous(),
    settingServerAPI.obtenirMap(),
  ]);

  const cure =
    pretres.find((p) => /^cur[ée]/i.test(p.function)) ?? pretres[0] ?? null;
  const autres = pretres.filter((p) => p.id !== cure?.id);
  const motDuCure = settings["pastor_word.message"] || "";

  return (
    <>
      <BandeauPage
        filigrane
        fil={[
          { label: "Accueil", href: "/" },
          { label: "La paroisse" },
          { label: "Équipe pastorale" },
        ]}
        sousTitre="Les prêtres, les conseils et les services qui font vivre au quotidien la paroisse Saint Sauveur Miséricordieux."
        titre="L’équipe pastorale"
      />

      {cure && (
        <section
          className={cn(
            CONTENEUR,
            "grid grid-cols-1 gap-8 pb-12 pt-14 lg:grid-cols-12 lg:gap-x-6 lg:pb-[60px] lg:pt-20",
          )}
        >
          <div className={cn(SURTITRE, "lg:col-span-12")}>
            01 — Équipe presbytérale
          </div>
          <EmplacementImage
            alt={`Portrait : ${cure.fullname}`}
            className="h-[380px] w-full lg:col-span-5 lg:h-[560px]"
            libelle="Portrait du curé"
            src={cure.photo}
          />
          <div className="flex flex-col justify-center gap-5 lg:col-span-6 lg:col-start-7">
            <span className={SURTITRE}>Curé de la paroisse</span>
            <h2 className="m-0 font-heading text-[30px] font-extrabold leading-[1.1] text-marine lg:text-[40px]">
              {cure.fullname}
            </h2>
            {(cure.ordination_year || cure.since_year || cure.congregation) && (
              <dl className="m-0 grid grid-cols-[150px_minmax(0,1fr)] gap-y-2.5 border-y border-ligne py-[18px] text-base lg:grid-cols-[170px_minmax(0,1fr)]">
                {cure.ordination_year && (
                  <>
                    <dt className="text-gris">Ordonné prêtre</dt>
                    <dd className="m-0">{cure.ordination_year}</dd>
                  </>
                )}
                {cure.since_year && (
                  <>
                    <dt className="text-gris">Curé depuis</dt>
                    <dd className="m-0">{cure.since_year}</dd>
                  </>
                )}
                {cure.congregation && (
                  <>
                    <dt className="text-gris">Congrégation / diocèse</dt>
                    <dd className="m-0">{cure.congregation}</dd>
                  </>
                )}
              </dl>
            )}
            {motDuCure && (
              <p className="m-0 whitespace-pre-line font-scripture text-xl leading-[1.5] text-marine lg:text-[23px]">
                « {motDuCure} »
              </p>
            )}
            {cure.biography && (
              <p className="m-0 whitespace-pre-line text-base leading-[1.7] text-encre-douce lg:text-[17px]">
                {cure.biography}
              </p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="rounded-charte bg-marine px-6 py-[15px] text-center text-[15px] font-bold text-white hover:bg-marine-deep hover:text-white hover:no-underline"
                href="#rdv"
              >
                Prendre rendez-vous
              </a>
              <Link
                className="rounded-charte border border-marine px-6 py-3.5 text-center text-[15px] font-bold text-marine hover:text-marine hover:no-underline"
                href="/parole-du-jour"
              >
                Lire ses homélies
              </Link>
            </div>
          </div>
        </section>
      )}

      {autres.length > 0 && (
        <section
          className={cn(
            CONTENEUR,
            "flex flex-col gap-[30px] pb-16 lg:pb-[70px]",
          )}
        >
          <div className="-mb-1.5 text-sm font-bold text-marine">
            Vicaires et père résident
          </div>
          <Vicaires pretres={autres} />
        </section>
      )}

      {conseils.length > 0 && (
        <section className="border-y border-ligne bg-white">
          <div
            className={cn(
              CONTENEUR,
              "grid grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-20",
            )}
          >
            <div className="flex flex-col gap-4 lg:col-span-4">
              <span className={SURTITRE}>02 — Au service de la paroisse</span>
              <h2 className={TITRE_H2}>Conseils et services</h2>
              <p className="m-0 text-base leading-[1.6] text-gris lg:text-[17px]">
                Des laïcs engagés accompagnent les prêtres dans la conduite de
                la paroisse.
              </p>
            </div>
            <ul className="m-0 flex list-none flex-col p-0 lg:col-span-7 lg:col-start-6">
              {conseils.map((c) => (
                <li
                  key={c.id}
                  className="grid grid-cols-1 gap-2 border-t border-ligne py-[22px] md:grid-cols-[minmax(0,1fr)_220px] md:gap-6"
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-heading text-lg font-bold text-marine">
                      {c.name}
                    </span>
                    {c.role && (
                      <span className="text-[15px] leading-[1.5] text-encre-douce">
                        {c.role}
                      </span>
                    )}
                  </div>
                  {(c.leader_title || c.leader_name) && (
                    <div className="flex flex-col gap-0.5 md:text-right">
                      <span className="text-[13px] text-gris">
                        {c.leader_title}
                      </span>
                      <span className="text-base font-semibold">
                        {c.leader_name}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section
        className={cn(
          CONTENEUR,
          "grid scroll-mt-4 grid-cols-1 gap-8 py-14 lg:grid-cols-12 lg:gap-x-6 lg:py-20",
        )}
        id="rdv"
      >
        <div className="flex flex-col gap-4 lg:col-span-4">
          <span className={SURTITRE}>03 — Rencontrer un prêtre</span>
          <h2 className={TITRE_H2}>Demander un rendez-vous</h2>
          <p className="m-0 text-base leading-[1.6] text-gris lg:text-[17px]">
            Le secrétariat vous recontacte pour confirmer le jour et l’heure.
            Les confessions ont aussi lieu sans rendez-vous aux horaires
            indiqués.
          </p>
        </div>
        <div className="border border-ligne bg-white p-6 lg:col-span-7 lg:col-start-6 lg:p-[34px]">
          <FormulaireRendezVous pretres={pretres} />
        </div>
      </section>
    </>
  );
}
