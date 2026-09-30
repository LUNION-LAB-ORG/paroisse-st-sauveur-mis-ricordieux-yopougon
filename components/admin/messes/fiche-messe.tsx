"use client";

import type { IDemandeMesseAdmin } from "@/features/messe/types/messe-admin.type";

import {
  FORMULES,
  intentionDe,
  libelleDemande,
  MOYENS_PAIEMENT,
  numeroDemande,
  pourQui,
  statutPaiement,
} from "./libelles";

import { BoutonIndisponible } from "@/components/admin/demandes/elements";
import { numeroLisible } from "@/components/admin/demandes/outils";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  Avertissement,
  BoutonAdmin,
  Carte,
  DetailsFiche,
  Encart,
  Pastille,
} from "@/components/admin/ui/kit";
import { useModifierDemandeMesseMutation } from "@/features/messe/queries/messe-admin.query";
import { dateSansAnnee, formatMontant, heureCourte } from "@/lib/charte";

/** Fiche de droite de l'écran « Demandes de messe ». */
export function FicheMesse({
  demande,
  peutModifier,
  onDeplacer,
}: {
  demande: IDemandeMesseAdmin;
  peutModifier: boolean;
  onDeplacer: () => void;
}) {
  const { confirmer, fenetre } = useConfirmation();
  const modifier = useModifierDemandeMesseMutation();
  const statut = statutPaiement(demande);
  const payee = demande.payment_status === "succeeded";
  const annulee = demande.request_status === "canceled";
  const programmees = demande.schedules ?? [];
  const moyen = demande.payment_method
    ? (MOYENS_PAIEMENT[demande.payment_method] ?? demande.payment_method)
    : "—";

  const encaisser = async () => {
    if (
      !(await confirmer({
        titre: "Enregistrer l’encaissement ?",
        message: `L’offrande de ${formatMontant(demande.amount)} FCFA pour la demande ${numeroDemande(demande)} sera marquée comme payée.`,
        libelleConfirmer: "Marquer comme payée",
      }))
    )
      return;
    modifier.mutate({
      id: demande.id,
      data: { payment_status: "succeeded" },
      succes: "Encaissement enregistré",
    });
  };

  const changerStatut = async (s: "accepted" | "canceled") => {
    if (
      s === "canceled" &&
      !(await confirmer({
        titre: "Annuler cette demande ?",
        message:
          "Les messes programmées seront libérées. Cette action est enregistrée dans le journal.",
        libelleConfirmer: "Annuler la demande",
        danger: true,
      }))
    )
      return;
    modifier.mutate({
      id: demande.id,
      data: { request_status: s },
      succes: s === "accepted" ? "Demande validée" : "Demande annulée",
    });
  };

  return (
    <Carte
      accent
      as="aside"
      className="self-start"
      corpsClassName="flex flex-col gap-3.5 p-5 md:p-[22px]"
    >
      {fenetre}
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 font-heading text-lg font-extrabold text-marine">
          {numeroDemande(demande)}
        </h2>
        <Pastille ton={statut.ton}>{statut.label}</Pastille>
      </div>
      <DetailsFiche
        lignes={[
          { libelle: "Intention", valeur: intentionDe(demande) },
          { libelle: "Pour", valeur: pourQui(demande) },
          {
            libelle: "Formule",
            valeur: (
              <span className="font-normal">
                {FORMULES[demande.formula]?.label ?? "Une messe"}
              </span>
            ),
          },
          {
            libelle: "Messe(s)",
            valeur: (
              <span className="flex flex-col gap-0.5 font-normal">
                {programmees.length
                  ? programmees.map((s) => (
                      <span key={s.id}>
                        {dateSansAnnee(s.date)} · {heureCourte(s.time)}
                        {s.shifted && (
                          <span className="text-attention"> (décalée)</span>
                        )}
                      </span>
                    ))
                  : demande.date_at
                    ? `${dateSansAnnee(demande.date_at.slice(0, 10))} · ${heureCourte(demande.time_at)}`
                    : "—"}
              </span>
            ),
          },
          {
            libelle: "Demandeur",
            valeur: <span className="font-normal">{demande.fullname}</span>,
          },
          {
            libelle: "WhatsApp",
            valeur: (
              <span className="font-normal">
                {numeroLisible(demande.phone)}
              </span>
            ),
          },
          {
            libelle: "Offrande",
            valeur: (
              <span className="font-normal">
                {formatMontant(demande.amount)} FCFA · {moyen}
              </span>
            ),
          },
          {
            libelle: "Demande",
            valeur: (
              <span className="font-normal">{libelleDemande(demande)}</span>
            ),
          },
        ]}
      />
      <Encart titre="Texte de l’intention">
        <span>{demande.message || "—"}</span>
      </Encart>
      {demande.is_confidential && (
        <Avertissement>
          Intention confidentielle : noms non lus à voix haute
        </Avertissement>
      )}
      {demande.needs_review && (
        <Avertissement>
          Une ou plusieurs messes ont été décalées faute de place : à vérifier.
        </Avertissement>
      )}
      {peutModifier ? (
        <div className="mt-1 flex flex-col gap-2">
          <BoutonAdmin
            className="w-full"
            isDisabled={payee || annulee}
            isPending={modifier.isPending}
            variante="marine"
            onPress={encaisser}
          >
            {payee ? "Paiement enregistré" : "Enregistrer l’encaissement"}
          </BoutonAdmin>
          <BoutonIndisponible afficherAide={false}>
            Renvoyer la confirmation WhatsApp
          </BoutonIndisponible>
          <BoutonAdmin
            className="w-full"
            isDisabled={!programmees.length || annulee}
            variante="neutre"
            onPress={onDeplacer}
          >
            Déplacer la date
          </BoutonAdmin>
          <span className="text-xs text-gris">
            Confirmation WhatsApp : disponible dès que WhatsApp Business sera
            configuré.
          </span>
          {!annulee && (
            <div className="flex flex-wrap justify-between gap-2 border-t border-bord-admin pt-2">
              {demande.request_status === "pending" ? (
                <BoutonAdmin
                  className="text-marine"
                  variante="lien"
                  onPress={() => changerStatut("accepted")}
                >
                  Valider la demande
                </BoutonAdmin>
              ) : (
                <span />
              )}
              <BoutonAdmin
                variante="lien"
                onPress={() => changerStatut("canceled")}
              >
                Annuler la demande
              </BoutonAdmin>
            </div>
          )}
        </div>
      ) : (
        <p className="m-0 text-[13px] text-gris">
          Consultation seule : l’encaissement et le déplacement sont réservés au
          secrétariat.
        </p>
      )}
    </Carte>
  );
}
