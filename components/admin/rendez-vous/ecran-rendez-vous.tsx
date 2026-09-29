"use client";

import type { IRendezVous } from "@/features/ecoute/types/rendez-vous.type";
import type { IPretre } from "@/features/pretre/types/pretre.type";

import { useRef, useState } from "react";

import {
  dateHeure,
  lienWhatsapp,
  numeroLisible,
  recue,
} from "@/components/admin/demandes/outils";
import { useConfirmation } from "@/components/admin/ui/confirmation";
import {
  BoutonAdmin,
  Carte,
  ChampChoixAdmin,
  ChampTexteAdmin,
  ContenuAdmin,
  DetailsFiche,
  EnTeteAdmin,
  Encart,
  ErreurChargement,
  EtatVide,
  GrilleListeFiche,
  type IColonne,
  Pastille,
  PiedListe,
  TableauAdmin,
  type TonPastille,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import {
  useModifierRendezVousMutation,
  useRendezVousQuery,
} from "@/features/ecoute/queries/rendez-vous.query";
import { usePretresAdminQuery } from "@/features/pretre/queries/pretre-admin.query";

function statut(r: IRendezVous): { label: string; ton: TonPastille } {
  switch (r.request_status) {
    case "confirmed":
    case "accepted":
      return { label: "Confirmé", ton: "succes" };
    case "closed":
      return { label: "Clos", ton: "neutre" };
    case "canceled":
      return { label: "Annulé", ton: "neutre" };
    default:
      return r.assigned_priest_id
        ? { label: "Attribué", ton: "attention" }
        : { label: "Nouveau", ton: "danger" };
  }
}

const nomPretre = (p?: { fullname: string; function: string | null } | null) =>
  p ? p.function || p.fullname : "—";

const souhait = (r: IRendezVous) =>
  [
    r.priest ? `${r.priest.function ?? ""} ${r.priest.fullname}`.trim() : null,
    r.availability,
  ]
    .filter(Boolean)
    .join(", ") || "Indifférent";

const COLONNES: IColonne<IRendezVous>[] = [
  {
    cle: "recue",
    titre: "Reçue",
    rendu: (r) => (
      <span className="whitespace-nowrap text-gris">{recue(r.created_at)}</span>
    ),
  },
  {
    cle: "nom",
    titre: "Demandeur",
    rendu: (r) => <span className="font-bold">{r.fullname}</span>,
  },
  {
    cle: "motif",
    titre: "Motif",
    rendu: (r) => r.type || "—",
    secondaire: true,
  },
  {
    cle: "pretre",
    titre: "Prêtre",
    rendu: (r) => nomPretre(r.assigned_priest),
    secondaire: true,
  },
  {
    cle: "statut",
    titre: "Statut",
    rendu: (r) => {
      const s = statut(r);

      return <Pastille ton={s.ton}>{s.label}</Pastille>;
    },
  },
];

export function EcranRendezVous() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("rendez-vous");
  const requete = useRendezVousQuery();
  const pretres = usePretresAdminQuery();
  const [choisi, setChoisi] = useState<number | null>(null);
  const refFiche = useRef<HTMLDivElement>(null);
  const lignes = requete.data?.data ?? [];
  const fiche = lignes.find((l) => l.id === choisi) ?? lignes[0] ?? null;

  return (
    <>
      <EnTeteAdmin
        sousTitre="Demandes reçues depuis la page Équipe pastorale"
        titre="Rendez-vous avec un prêtre"
      />
      <ContenuAdmin>
        <GrilleListeFiche
          fiche={
            <div ref={refFiche} className="scroll-mt-4 self-start">
              {fiche ? (
                <FicheRendezVous
                  key={fiche.id}
                  peutModifier={peutModifier}
                  pretres={(pretres.data ?? []).filter(
                    (p) => p.status !== "hidden",
                  )}
                  rdv={fiche}
                />
              ) : (
                !requete.isLoading &&
                !requete.isError && (
                  <Carte accent as="aside">
                    <EtatVide>Aucune demande à afficher.</EtatVide>
                  </Carte>
                )
              )}
            </div>
          }
          largeurFiche={420}
          liste={
            <Carte className="min-w-0 self-start">
              {requete.isError ? (
                <div className="p-5">
                  <ErreurChargement
                    message="Les demandes de rendez-vous n’ont pas pu être chargées."
                    onReessayer={() => requete.refetch()}
                  />
                </div>
              ) : (
                <TableauAdmin
                  chargement={requete.isLoading}
                  cleLigne={(r) => r.id}
                  colonnes={COLONNES}
                  lignes={lignes}
                  selection={fiche?.id ?? null}
                  vide="Aucune demande de rendez-vous pour l’instant."
                  onChoisir={(r) => {
                    setChoisi(r.id);
                    if (window.matchMedia("(max-width: 1279px)").matches)
                      refFiche.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              )}
              {lignes.length > 0 && (
                <PiedListe
                  droite="Cliquez sur une ligne pour ouvrir la fiche"
                  gauche={`${requete.data?.meta?.total ?? lignes.length} demande(s)`}
                />
              )}
            </Carte>
          }
        />
      </ContenuAdmin>
    </>
  );
}

/** « 2026-10-03 10:00:00 » ↔ valeur d'un champ datetime-local */
const versChamp = (iso: string | null) =>
  iso ? iso.replace(" ", "T").slice(0, 16) : "";

function FicheRendezVous({
  rdv,
  pretres,
  peutModifier,
}: {
  rdv: IRendezVous;
  pretres: IPretre[];
  peutModifier: boolean;
}) {
  const modifier = useModifierRendezVousMutation();
  const { confirmer, fenetre } = useConfirmation();
  const [quand, setQuand] = useState(versChamp(rdv.proposed_at));
  const [erreurs, setErreurs] = useState<Record<string, string>>({});
  const s = statut(rdv);
  const termine =
    rdv.request_status === "closed" || rdv.request_status === "canceled";
  const confirme =
    rdv.request_status === "confirmed" || rdv.request_status === "accepted";
  const pretre = rdv.assigned_priest;

  const attribuer = (id: string) => {
    setErreurs((e) => ({ ...e, pretre: "" }));
    modifier.mutate({
      id: rdv.id,
      data: { assigned_priest_id: id ? Number(id) : null },
      succes: id ? "Demande attribuée" : "Attribution retirée",
    });
  };

  const confirmerRdv = () => {
    const e: Record<string, string> = {};

    if (!rdv.assigned_priest_id) e.pretre = "Attribuez la demande à un prêtre.";
    if (!quand) e.quand = "Indiquez la date et l’heure proposées.";
    else if (new Date(quand) < new Date())
      e.quand = "La date proposée est déjà passée.";
    setErreurs(e);
    if (Object.keys(e).length) return;
    modifier.mutate({
      id: rdv.id,
      data: {
        assigned_priest_id: rdv.assigned_priest_id,
        proposed_at: `${quand.replace("T", " ")}:00`,
        request_status: "confirmed",
      },
      succes: "Rendez-vous confirmé",
    });
  };

  const clore = async () => {
    if (
      await confirmer({
        titre: "Clore cette demande ?",
        message:
          "Elle restera consultable dans la liste avec le statut « Clos ».",
        libelleConfirmer: "Clore la demande",
      })
    )
      modifier.mutate({
        id: rdv.id,
        data: { request_status: "closed" },
        succes: "Demande close",
      });
  };

  const messageWhatsapp = `Bonjour ${rdv.fullname}, votre rendez-vous avec ${
    pretre ? `${pretre.function ?? ""} ${pretre.fullname}`.trim() : "un prêtre"
  } est confirmé le ${dateHeure(rdv.proposed_at).replace(" ", " à ")}. Paroisse Saint Sauveur Miséricordieux.`;

  return (
    <Carte
      accent
      as="aside"
      corpsClassName="flex flex-col gap-3.5 p-5 md:p-[22px]"
    >
      {fenetre}
      <div className="flex items-center justify-between gap-3">
        <h2 className="m-0 min-w-0 break-words font-heading text-lg font-extrabold text-marine">
          {rdv.fullname}
        </h2>
        <Pastille ton={s.ton}>{s.label}</Pastille>
      </div>
      <DetailsFiche
        lignes={[
          { libelle: "Motif", valeur: rdv.type || "—" },
          {
            libelle: "Souhait",
            valeur: <span className="font-normal">{souhait(rdv)}</span>,
          },
          {
            libelle: "WhatsApp",
            valeur: (
              <span className="font-normal">{numeroLisible(rdv.phone)}</span>
            ),
          },
          ...(rdv.proposed_at
            ? [
                {
                  libelle: "Proposé le",
                  valeur: (
                    <span className="font-normal">
                      {dateHeure(rdv.proposed_at)}
                    </span>
                  ),
                },
              ]
            : []),
        ]}
      />
      <Encart>
        <span className="whitespace-pre-line">{rdv.message || "—"}</span>
      </Encart>
      {peutModifier && !termine ? (
        <>
          <ChampChoixAdmin
            erreur={erreurs.pretre}
            isDisabled={modifier.isPending}
            label="Attribuer à"
            options={pretres.map((p) => ({
              valeur: String(p.id),
              label: `${p.function} · ${p.fullname}`,
            }))}
            placeholder="Choisir un prêtre"
            value={rdv.assigned_priest_id ? String(rdv.assigned_priest_id) : ""}
            onChange={attribuer}
          />
          <ChampTexteAdmin
            erreur={erreurs.quand}
            label="Date et heure proposées"
            type="datetime-local"
            value={quand}
            onChange={(v) => {
              setQuand(v);
              setErreurs((e) => ({ ...e, quand: "" }));
            }}
          />
          <BoutonAdmin
            className="w-full"
            isPending={modifier.isPending}
            variante="marine"
            onPress={confirmerRdv}
          >
            {confirme
              ? "Mettre à jour le rendez-vous"
              : "Confirmer le rendez-vous"}
          </BoutonAdmin>
          {confirme && rdv.phone ? (
            <BoutonAdmin
              cible="_blank"
              className="w-full"
              href={lienWhatsapp(rdv.phone, messageWhatsapp)}
              variante="contour"
            >
              Prévenir par WhatsApp
            </BoutonAdmin>
          ) : null}
          <span className="text-xs text-gris">
            Envoi automatique de la confirmation : disponible dès que WhatsApp
            Business sera configuré. En attendant, « Prévenir par WhatsApp »
            ouvre la conversation avec le message prérempli.
          </span>
          <BoutonAdmin
            className="w-full"
            isDisabled={modifier.isPending}
            variante="neutre"
            onPress={clore}
          >
            Clore la demande
          </BoutonAdmin>
        </>
      ) : (
        <DetailsFiche
          lignes={[
            {
              libelle: "Prêtre",
              valeur: pretre
                ? `${pretre.function ?? ""} ${pretre.fullname}`.trim()
                : "—",
            },
          ]}
        />
      )}
      {!peutModifier && (
        <p className="m-0 text-[13px] text-gris">
          Consultation seule : l’attribution est réservée aux prêtres et au
          secrétariat.
        </p>
      )}
    </Carte>
  );
}
