"use client";

import type { IDonAdmin } from "@/features/don/apis/don-admin.api";

import { toast } from "@heroui/react";
import { useState } from "react";

import { ProjetEglise } from "./projet-eglise";
import { SaisieDon } from "./saisie-don";

import { PaginationSimple } from "@/components/admin/demandes/elements";
import { jourMois } from "@/components/admin/demandes/outils";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  Carte,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  Filtres,
  type IColonne,
  Pastille,
  PiedListe,
  TableauAdmin,
  type TonPastille,
} from "@/components/admin/ui/kit";
import { telechargerExport } from "@/features/admin/apis/admin.api";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  useDonsAdminQuery,
  useModifierDonMutation,
} from "@/features/don/queries/don-admin.query";
import { dateDuJour, formatMontant } from "@/lib/charte";

type IFiltreDons = "tous" | "en_ligne" | "hors_ligne" | "a_verifier";

const FILTRES: { valeur: IFiltreDons; label: string }[] = [
  { valeur: "tous", label: "Tous" },
  { valeur: "en_ligne", label: "En ligne" },
  { valeur: "hors_ligne", label: "Hors ligne" },
  { valeur: "a_verifier", label: "À vérifier" },
];

/** Moyens de paiement en ligne (les autres sont saisis au secrétariat). */
const EN_LIGNE = new Set([
  "wave",
  "orange_money",
  "orange",
  "mtn",
  "moov",
  "card",
]);

const MOYENS: Record<string, string> = {
  wave: "Wave",
  orange_money: "Orange Money",
  orange: "Orange Money",
  mtn: "MTN MoMo",
  moov: "Moov Money",
  card: "Carte bancaire",
  especes: "Espèces (saisi)",
  cheque: "Chèque (saisi)",
  virement: "Virement (saisi)",
  autre: "Autre (saisi)",
};

const STATUTS: Record<string, { label: string; ton: TonPastille }> = {
  succeeded: { label: "Payé", ton: "succes" },
  pending: { label: "En attente", ton: "info" },
  failed: { label: "Échoué", ton: "danger" },
};

const enLigne = (d: IDonAdmin) => !!d.paymethod && EN_LIGNE.has(d.paymethod);

export function EcranDons() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("dons");
  const [filtre, setFiltre] = useState<IFiltreDons>("tous");
  const [page, setPage] = useState(1);
  const [saisieOuverte, setSaisieOuverte] = useState(false);
  const [exportEnCours, setExportEnCours] = useState(false);
  const { confirmer, fenetre } = useConfirmation();
  const modifier = useModifierDonMutation();
  /* « En ligne » / « Hors ligne » regroupent plusieurs moyens : l'API ne filtrant
     que sur un moyen à la fois, on charge les 100 derniers dons et on filtre ici. */
  const groupe = filtre === "en_ligne" || filtre === "hors_ligne";
  const requete = useDonsAdminQuery({
    status: filtre === "a_verifier" ? "pending" : undefined,
    page: groupe ? 1 : page,
    per_page: groupe ? 100 : 20,
  });
  const brutes = requete.data?.data ?? [];
  const lignes = groupe
    ? brutes.filter((d) => (filtre === "en_ligne" ? enLigne(d) : !enLigne(d)))
    : brutes;
  const total = groupe
    ? lignes
        .filter((d) => d.payment_status === "succeeded")
        .reduce((s, d) => s + Number(d.amount || 0), 0)
    : (requete.data?.meta?.total_amount ??
      lignes
        .filter((d) => d.payment_status === "succeeded")
        .reduce((s, d) => s + Number(d.amount || 0), 0));
  const meta = requete.data?.meta;

  const valider = async (d: IDonAdmin) => {
    if (
      await confirmer({
        titre: "Confirmer la réception de ce don ?",
        message: `${d.donator} · ${formatMontant(Number(d.amount))} FCFA. Le don comptera dans le montant affiché sur le site.`,
        libelleConfirmer: "Marquer comme payé",
      })
    )
      modifier.mutate({
        id: d.id,
        data: { payment_status: "succeeded" },
        succes: "Don marqué comme payé",
      });
  };

  const colonnes: IColonne<IDonAdmin>[] = [
    {
      cle: "date",
      titre: "Date",
      rendu: (d) => (
        <span className="text-gris">
          {jourMois(d.donation_at ?? d.created_at)}
        </span>
      ),
    },
    {
      cle: "donateur",
      titre: "Donateur",
      rendu: (d) => (
        <span className="font-semibold">{d.donator || "Anonyme"}</span>
      ),
    },
    {
      cle: "montant",
      titre: "Montant",
      rendu: (d) => (
        <span className="whitespace-nowrap">
          {formatMontant(Number(d.amount || 0))} FCFA
        </span>
      ),
    },
    {
      cle: "moyen",
      titre: "Moyen",
      rendu: (d) => (
        <span className="whitespace-nowrap">
          {d.paymethod
            ? (MOYENS[d.paymethod] ?? d.paymethod)
            : "Au secrétariat"}
        </span>
      ),
      secondaire: true,
    },
    {
      cle: "affiche",
      titre: "Bienfaiteur affiché",
      rendu: (d) => (d.display_name ? "Oui" : "Non"),
      secondaire: true,
    },
    {
      cle: "statut",
      titre: "Statut",
      rendu: (d) => {
        const s = STATUTS[d.payment_status ?? "succeeded"] ?? STATUTS.pending;

        return (
          <span className="inline-flex flex-wrap items-center gap-2">
            <Pastille ton={s.ton}>{s.label}</Pastille>
            {peutModifier && d.payment_status === "pending" && !enLigne(d) && (
              <button
                className="text-[13px] font-bold text-rouge hover:underline"
                type="button"
                onClick={() => valider(d)}
              >
                Confirmer
              </button>
            )}
          </span>
        );
      },
    },
  ];

  const exporter = async () => {
    setExportEnCours(true);
    try {
      await telechargerExport("/donations/export", `dons-${dateDuJour()}.csv`, {
        status: filtre === "a_verifier" ? "pending" : "",
      });
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setExportEnCours(false);
    }
  };

  return (
    <>
      {fenetre}
      <EnTeteAdmin
        actions={
          <>
            <BoutonAdmin
              isPending={exportEnCours}
              variante="neutre"
              onPress={exporter}
            >
              Export comptable
            </BoutonAdmin>
            {peutModifier && (
              <BoutonAdmin
                variante="primaire"
                onPress={() => setSaisieOuverte(true)}
              >
                + Saisir un don reçu
              </BoutonAdmin>
            )}
          </>
        }
        sousTitre="Projet affiché sur le site et suivi des dons reçus"
        titre="Dons et nouvelle église"
      />
      <ContenuAdmin>
        <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[440px_minmax(0,1fr)]">
          <ProjetEglise peutModifier={peutModifier} />
          <Carte className="flex min-w-0 flex-col self-start">
            <div className="flex flex-col gap-3 border-b border-bord-admin px-4 py-3.5 md:flex-row md:items-center md:justify-between md:px-5">
              <Filtres
                label="Filtrer les dons"
                options={FILTRES}
                valeur={filtre}
                onChange={(v) => {
                  setFiltre(v);
                  setPage(1);
                }}
              />
              <span className="text-sm">
                Total affiché :{" "}
                <strong className="text-marine">
                  {formatMontant(total)} FCFA
                </strong>
              </span>
            </div>
            {requete.isError ? (
              <div className="p-5">
                <ErreurChargement
                  message="Les dons n’ont pas pu être chargés."
                  onReessayer={() => requete.refetch()}
                />
              </div>
            ) : (
              <TableauAdmin
                chargement={requete.isLoading}
                cleLigne={(d) => d.id}
                colonnes={colonnes}
                lignes={lignes}
                vide="Aucun don pour ce filtre."
              />
            )}
            <PiedListe
              droite={
                !groupe && (meta?.last_page ?? 1) > 1 ? (
                  <PaginationSimple
                    derniere={meta?.last_page ?? 1}
                    page={page}
                    onChange={setPage}
                  />
                ) : groupe && (meta?.total ?? 0) > 100 ? (
                  "Filtre appliqué aux 100 derniers dons"
                ) : undefined
              }
              gauche={`${groupe ? lignes.length : (meta?.total ?? lignes.length)} don(s) · le total ne compte que les dons payés`}
            />
          </Carte>
        </div>
      </ContenuAdmin>
      <SaisieDon
        ouverte={saisieOuverte}
        onFermer={() => setSaisieOuverte(false)}
      />
    </>
  );
}
