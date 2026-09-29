import type { Metadata } from "next";

import { BoutonImprimer } from "@/components/demande-messe/bouton-imprimer";
import { demandeMesseServerAPI } from "@/features/demande-messe/apis/demande-messe.server";
import { settingServerAPI } from "@/features/setting/apis/setting.server";
import { identiteParoisse } from "@/features/setting/utils/identite";
import { formatMontant, LOGO_PAR_DEFAUT } from "@/lib/charte";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reçu de demande de messe",
  robots: { index: false },
};

type Props = { searchParams: Promise<{ n?: string; t?: string }> };

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));

/** Reçu imprimable (« Enregistrer en PDF » depuis le navigateur). */
export default async function PageRecu({ searchParams }: Props) {
  const { n, t } = await searchParams;
  const [demande, settings] = await Promise.all([
    n && t ? demandeMesseServerAPI.obtenir(n, t) : null,
    settingServerAPI.obtenirMap(),
  ]);
  const identite = identiteParoisse(settings);

  if (!demande) {
    return (
      <p className="mx-auto max-w-[720px] px-4 py-20 text-base text-gris">
        Reçu introuvable.
      </p>
    );
  }

  const statut =
    demande.payment_status === "succeeded"
      ? "Payé"
      : demande.payment_status === "to_pay"
        ? "À régler au secrétariat"
        : "Paiement en cours de vérification";

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6 bg-white px-6 py-10 text-encre print:max-w-none print:p-0">
      <div className="flex items-center gap-4 border-b border-ligne pb-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          aria-hidden
          alt=""
          className="size-16 rounded-full"
          src={LOGO_PAR_DEFAUT}
        />
        <div className="flex flex-col">
          <span className="font-heading text-base font-extrabold uppercase text-marine">
            {identite.nom}
          </span>
          <span className="text-sm text-gris">
            {[identite.adresse, identite.telephone].filter(Boolean).join(" · ")}
          </span>
        </div>
      </div>
      <h1 className="m-0 font-heading text-2xl font-extrabold text-marine">
        Reçu — demande de messe n° {demande.number}
      </h1>
      <dl className="m-0 grid grid-cols-[180px_minmax(0,1fr)] gap-y-3 text-[15px]">
        <dt className="text-gris">Demandeur</dt>
        <dd className="m-0">{demande.fullname}</dd>
        <dt className="text-gris">Intention</dt>
        <dd className="m-0">
          {demande.intention_type} — {demande.for_whom}
          {demande.is_confidential && " (confidentielle)"}
        </dd>
        <dt className="text-gris">Messes</dt>
        <dd className="m-0">
          <ul className="m-0 list-none p-0">
            {demande.schedules.map((s, i) => (
              <li key={i}>
                {formatDate(s.date)}, {s.time} — {s.label}
              </li>
            ))}
          </ul>
        </dd>
        <dt className="text-gris">Offrande</dt>
        <dd className="m-0 font-semibold">
          {formatMontant(demande.amount)} FCFA
        </dd>
        <dt className="text-gris">Statut</dt>
        <dd className="m-0">{statut}</dd>
        <dt className="text-gris">Date de la demande</dt>
        <dd className="m-0">{formatDate(demande.created_at)}</dd>
      </dl>
      <p className="m-0 font-scripture text-lg italic text-marine">
        Merci pour votre offrande. Que le Seigneur vous bénisse.
      </p>
      <BoutonImprimer />
    </div>
  );
}
