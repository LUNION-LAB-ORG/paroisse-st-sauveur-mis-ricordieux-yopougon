import type { Metadata } from "next";
import type { IDemandeMesse } from "@/features/demande-messe/types/demande-messe.type";

import { ActionsConfirmation } from "@/components/demande-messe/actions-confirmation";
import { EtapesDemande } from "@/components/demande-messe/etapes-demande";
import { Recapitulatif } from "@/components/demande-messe/recapitulatif";
import { FilAriane } from "@/components/site/fil-ariane";
import {
  demandeMesseServerAPI,
  lienIcsDemande,
} from "@/features/demande-messe/apis/demande-messe.server";
import { CONTENEUR, formatMontant, LOGO_PAR_DEFAUT } from "@/lib/charte";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Demande de messe enregistrée",
  robots: { index: false },
};

const FORMULE: Record<IDemandeMesse["formula"], string> = {
  single: "Une messe",
  triduum: "Triduum",
  novena: "Neuvaine",
};
const PAIEMENT: Record<string, string> = {
  wave: "Wave",
  secretariat: "Au secrétariat",
  orange: "Orange Money",
  mtn: "MTN MoMo",
  moov: "Moov Money",
  card: "Carte bancaire",
};

const dateMin = (iso: string) => {
  const d = new Date(`${iso}T00:00:00Z`);
  const jour = d.getUTCDate() === 1 ? "1er" : String(d.getUTCDate());

  return `${new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: "UTC" }).format(d)} ${jour} ${new Intl.DateTimeFormat("fr-FR", { month: "long", timeZone: "UTC" }).format(d)}`;
};

type Props = { searchParams: Promise<{ n?: string; t?: string }> };

export default async function PageConfirmation({ searchParams }: Props) {
  const { n, t } = await searchParams;
  const demande = n && t ? await demandeMesseServerAPI.obtenir(n, t) : null;

  if (!demande) {
    return (
      <section className={cn(CONTENEUR, "flex flex-col gap-4 py-20")}>
        <h1 className="m-0 font-heading text-3xl font-extrabold text-marine">
          Demande introuvable
        </h1>
        <p className="m-0 text-base text-gris">
          Ce lien de confirmation n’est pas valide. Contactez le secrétariat
          paroissial si besoin.
        </p>
      </section>
    );
  }

  const premiere = demande.schedules[0];
  const paye = demande.payment_status === "succeeded";
  const enAttente = demande.payment_method === "wave" && !paye;
  const lienRecu = `/demande-messe/recu?n=${encodeURIComponent(demande.number)}&t=${encodeURIComponent(t!)}`;
  const decalees = demande.schedules.some((s) => s.shifted);

  return (
    <>
      <section className="bg-marine text-white">
        <div className={cn(CONTENEUR, "flex flex-col gap-3 pt-9 lg:pt-11")}>
          <FilAriane
            surFondMarine
            etapes={[
              { label: "Accueil", href: "/" },
              { label: "Services" },
              { label: "Demander une messe" },
            ]}
          />
          <h1 className="m-0 font-heading text-[30px] font-extrabold tracking-[-0.015em] lg:text-[40px]">
            Demander une messe
          </h1>
          <span className="text-base text-brume lg:text-lg">
            Confiez une intention à la prière de la communauté. Quatre étapes,
            environ deux minutes.
          </span>
          <EtapesDemande etape={5} />
        </div>
      </section>

      <section
        className={cn(
          CONTENEUR,
          "grid grid-cols-1 gap-6 pb-16 pt-8 lg:grid-cols-12 lg:gap-x-6 lg:pb-20 lg:pt-[50px]",
        )}
      >
        <div className="flex flex-col items-start gap-5 border border-ligne bg-white p-6 lg:col-span-8 lg:px-11 lg:py-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            aria-hidden
            alt=""
            className="size-[84px] rounded-full object-cover"
            src={LOGO_PAR_DEFAUT}
          />
          <span className="text-sm font-bold text-rouge">
            Demande n° {demande.number}
          </span>
          <h2 className="m-0 font-heading text-2xl font-extrabold text-marine lg:text-[30px]">
            Votre intention est confiée à la prière de la paroisse
          </h2>
          <p className="m-0 text-base leading-[1.6] text-encre-douce lg:text-[17px]">
            {premiere &&
              `La messe sera célébrée le ${dateMin(premiere.date)} (${premiere.label.toLowerCase()}, ${premiere.time})${demande.schedules.length > 1 ? ", puis les jours suivants" : ""}. `}
            {enAttente
              ? "Le paiement Wave est en cours de vérification : la confirmation et votre reçu vous seront envoyés sur WhatsApp dès sa validation."
              : demande.payment_status === "to_pay"
                ? `Votre demande est enregistrée « à régler » : merci de remettre l’offrande de ${formatMontant(demande.amount)} FCFA au secrétariat.`
                : "Une confirmation et votre reçu vous sont envoyés sur WhatsApp."}
          </p>
          {decalees && (
            <p className="m-0 border-l-2 border-rouge pl-3 text-sm leading-[1.5] text-encre-douce">
              Certaines messes ont été reportées au jour suivant faute de
              célébration à cette heure : le secrétariat vous contactera pour
              confirmer.
            </p>
          )}
          <p className="m-0 font-scripture text-xl italic leading-[1.5] text-marine lg:text-[22px]">
            « Là où deux ou trois sont réunis en mon nom, je suis au milieu
            d’eux. » (Mt 18, 20)
          </p>
          <ActionsConfirmation
            lienIcs={lienIcsDemande(demande.number, t!)}
            lienRecu={lienRecu}
          />
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-4 lg:col-start-9">
          <Recapitulatif
            lignes={[
              {
                label: "Intention",
                valeur:
                  demande.intention_type +
                  (demande.is_confidential ? " · confidentielle" : ""),
              },
              { label: "Pour", valeur: demande.for_whom },
              {
                label: "Célébration",
                valeur: `${FORMULE[demande.formula]}${premiere ? `${demande.schedules.length > 1 ? ", à partir du " : ", le "}${dateMin(premiere.date)}` : ""}`,
              },
              {
                label: "Messe",
                valeur: premiere ? `${premiere.time} · ${premiere.label}` : "—",
              },
              {
                label: "Offrande",
                valeur: `${formatMontant(demande.amount)} FCFA`,
              },
              {
                label: "Paiement",
                valeur: `${PAIEMENT[demande.payment_method] ?? demande.payment_method}${paye ? " · payé" : demande.payment_status === "to_pay" ? " · à régler" : ""}`,
              },
            ]}
          />
        </aside>
      </section>
    </>
  );
}
