"use client";

import type {
  IAbonne,
  IStatutAbonne,
} from "@/features/abonnement/types/abonnement-admin.type";

import { toast } from "@heroui/react";
import { useEffect, useState } from "react";

import {
  BoutonIndisponible,
  ChampRecherche,
  PaginationSimple,
} from "@/components/admin/demandes/elements";
import {
  AIDE_WHATSAPP,
  dateHeure,
  numeroMasque,
} from "@/components/admin/demandes/outils";
import {
  BoutonAdmin,
  CaseAdmin,
  Carte,
  ChampChoixAdmin,
  ChampZoneAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  Filtres,
  type IColonne,
  Pastille,
  PiedListe,
  TableauAdmin,
} from "@/components/admin/ui/kit";
import {
  useAbonnesQuery,
  useModifierEnvoiAutoMutation,
  useParametresWhatsappQuery,
  useStatsAbonnesQuery,
} from "@/features/abonnement/queries/abonnement-admin.query";
import { telechargerExport } from "@/features/admin/apis/admin.api";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { dateDuJour, formatMontant } from "@/lib/charte";

const ENVOIS = [
  {
    nom: "Parole du jour + homélie",
    quand: "Chaque jour à 05:30",
    cle: "whatsapp.auto_parole",
  },
  {
    nom: "Feuille d’annonces",
    quand: "Chaque dimanche à 07:00",
    cle: "whatsapp.auto_annonces",
  },
  {
    nom: "Confirmation de demande de messe",
    quand: "À chaque demande",
    cle: "whatsapp.auto_confirmations",
  },
  {
    nom: "Reçu de don",
    quand: "À chaque paiement confirmé · même réglage que les confirmations",
    cle: "whatsapp.auto_confirmations",
  },
  {
    nom: "Rappel d’événement",
    quand: "La veille à 18:00",
    cle: "whatsapp.auto_rappels",
  },
];

const LISTES: Record<string, string> = {
  parole: "Parole du jour",
  annonces: "Annonces",
};

const SOURCES: Record<string, string> = {
  home: "Accueil du site",
  announcements: "Page Annonces",
  mass_request: "Demande de messe",
  event: "Page Événement",
  donation: "Page Dons",
};

const FILTRES: { valeur: IStatutAbonne; label: string }[] = [
  { valeur: "active", label: "Abonnés actifs" },
  { valeur: "unsubscribed", label: "Désabonnés" },
  { valeur: "", label: "Tous" },
];

const COLONNES: IColonne<IAbonne>[] = [
  {
    cle: "numero",
    titre: "Numéro",
    rendu: (a) => (
      <span className="inline-flex flex-wrap items-center gap-2 whitespace-nowrap">
        {numeroMasque(a.phone)}
        {a.unsubscribed_at && <Pastille>Désabonné</Pastille>}
      </span>
    ),
  },
  {
    cle: "listes",
    titre: "Listes",
    rendu: (a) => (a.lists ?? []).map((l) => LISTES[l] ?? l).join(", ") || "—",
  },
  {
    cle: "consentement",
    titre: "Consentement",
    rendu: (a) => (
      <span className="whitespace-nowrap">{dateHeure(a.consented_at)}</span>
    ),
    secondaire: true,
  },
  {
    cle: "source",
    titre: "Source",
    rendu: (a) => (a.source ? (SOURCES[a.source] ?? a.source) : "—"),
    secondaire: true,
  },
];

const actif = (v?: string | null) => v === "1" || v === "true";

function CarteChiffre({
  titre,
  valeur,
  note,
}: {
  titre: string;
  valeur: React.ReactNode;
  note: string;
}) {
  return (
    <Carte corpsClassName="flex flex-col gap-1.5 p-5">
      <span className="text-sm text-gris">{titre}</span>
      <span className="font-heading text-[30px] font-extrabold leading-tight text-marine">
        {valeur}
      </span>
      <span className="text-[13px] text-gris">{note}</span>
    </Carte>
  );
}

export function EcranAbonnes() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("abonnes");
  const stats = useStatsAbonnesQuery();
  const parametres = useParametresWhatsappQuery();
  const modifierEnvoi = useModifierEnvoiAutoMutation();
  const [statut, setStatut] = useState<IStatutAbonne>("active");
  const [saisie, setSaisie] = useState("");
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const [liste, setListe] = useState("annonces");
  const [message, setMessage] = useState("");
  const [exportEnCours, setExportEnCours] = useState(false);
  const abonnes = useAbonnesQuery({
    status: statut,
    phone: recherche || undefined,
    page,
  });
  const meta = abonnes.data?.meta;

  useEffect(() => {
    const t = setTimeout(() => {
      setRecherche(saisie.replace(/[^\d+]/g, ""));
      setPage(1);
    }, 300);

    return () => clearTimeout(t);
  }, [saisie]);

  const chiffre = (n?: number) =>
    stats.isLoading
      ? "…"
      : stats.isError || n === undefined
        ? "—"
        : formatMontant(n);

  const exporter = async () => {
    setExportEnCours(true);
    try {
      await telechargerExport(
        "/subscriptions/export",
        `abonnes-whatsapp-${dateDuJour()}.csv`,
        {
          status: statut,
        },
      );
    } catch (e) {
      toast.danger((e as Error).message);
    } finally {
      setExportEnCours(false);
    }
  };

  return (
    <>
      <EnTeteAdmin
        actions={
          <BoutonAdmin
            isPending={exportEnCours}
            variante="neutre"
            onPress={exporter}
          >
            Exporter la liste
          </BoutonAdmin>
        }
        sousTitre="Listes de diffusion, envois automatiques et consentements"
        titre="Abonnés WhatsApp"
      />
      <ContenuAdmin>
        {stats.isError && (
          <ErreurChargement
            message="Les statistiques des listes n’ont pas pu être chargées."
            onReessayer={() => stats.refetch()}
          />
        )}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <CarteChiffre
            note="abonnés actifs"
            titre="Parole du jour (chaque matin)"
            valeur={chiffre(
              stats.data?.data?.lists?.parole ?? (stats.data ? 0 : undefined),
            )}
          />
          <CarteChiffre
            note="abonnés actifs"
            titre="Annonces (chaque dimanche)"
            valeur={chiffre(
              stats.data?.data?.lists?.annonces ?? (stats.data ? 0 : undefined),
            )}
          />
          <CarteChiffre
            note="par le mot « STOP »"
            titre="Désabonnements (30 jours)"
            valeur={chiffre(stats.data?.data?.unsubscribed_30d)}
          />
        </div>
        <div className="grid grid-cols-1 items-start gap-[22px] xl:grid-cols-[minmax(0,1fr)_440px]">
          <Carte titre="Envois automatiques">
            {parametres.isError && (
              <div className="px-5 py-3">
                <ErreurChargement
                  message="Les réglages d’envoi n’ont pas pu être chargés."
                  onReessayer={() => parametres.refetch()}
                />
              </div>
            )}
            <ul className="m-0 list-none p-0">
              {ENVOIS.map((e, i) => {
                const valeur = parametres.data?.[e.cle];
                const connu = valeur !== undefined;
                const on = actif(valeur);

                return (
                  <li
                    key={e.nom}
                    className={
                      "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-5 py-3.5 sm:grid-cols-[minmax(0,1fr)_170px_90px] " +
                      (i > 0 ? "border-t border-ligne-admin" : "")
                    }
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-bold">{e.nom}</span>
                      <span className="text-[13px] text-gris">{e.quand}</span>
                    </span>
                    <span
                      className="order-last col-span-2 text-[13px] font-bold text-attention sm:order-none sm:col-span-1"
                      title={AIDE_WHATSAPP}
                    >
                      Modèle à valider par Meta
                    </span>
                    <CaseAdmin
                      isDisabled={
                        !peutModifier || !connu || modifierEnvoi.isPending
                      }
                      valeur={on}
                      onChange={(v) =>
                        modifierEnvoi.mutate({
                          cle: e.cle,
                          actif: v,
                          nom: e.nom,
                        })
                      }
                    >
                      <span className="font-normal">
                        {parametres.isLoading
                          ? "…"
                          : !connu
                            ? "Indisponible"
                            : on
                              ? "Actif"
                              : "Pause"}
                      </span>
                    </CaseAdmin>
                  </li>
                );
              })}
            </ul>
            <p className="m-0 border-t border-ligne-admin px-5 py-3 text-[13px] text-gris">
              {peutModifier
                ? "Ces réglages prendront effet dès que WhatsApp Business sera configuré (Paramètres › Intégrations)."
                : "Seul un administrateur peut modifier les envois automatiques."}
            </p>
          </Carte>
          <Carte
            className="self-start"
            corpsClassName="flex flex-col gap-3 p-5"
          >
            <h2 className="m-0 font-heading text-base font-extrabold text-marine">
              Message exceptionnel
            </h2>
            <ChampChoixAdmin
              isDisabled
              label="Liste"
              options={[
                { valeur: "annonces", label: "Annonces" },
                { valeur: "parole", label: "Parole du jour" },
                { valeur: "toutes", label: "Toutes les listes" },
              ]}
              value={liste}
              onChange={setListe}
            />
            <ChampZoneAdmin
              isDisabled
              label="Message"
              placeholder="Texte du message, selon un modèle validé"
              rows={4}
              value={message}
              onChange={setMessage}
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <BoutonIndisponible afficherAide={false} className="flex-1">
                M’envoyer un test
              </BoutonIndisponible>
              <BoutonIndisponible
                afficherAide={false}
                className="flex-1"
                variante="marine"
              >
                Programmer l’envoi
              </BoutonIndisponible>
            </div>
            <p className="m-0 text-[13px] text-gris">{AIDE_WHATSAPP}</p>
          </Carte>
        </div>
        <Carte className="min-w-0">
          <div className="flex flex-col gap-3 border-b border-bord-admin px-4 py-3.5 md:flex-row md:items-center md:justify-between md:px-5">
            <Filtres
              label="Filtrer les abonnés"
              options={FILTRES}
              valeur={statut}
              onChange={(v) => {
                setStatut(v);
                setPage(1);
              }}
            />
            <ChampRecherche
              label="Rechercher un numéro"
              placeholder="Rechercher un numéro…"
              valeur={saisie}
              onChange={setSaisie}
            />
          </div>
          {abonnes.isError ? (
            <div className="p-5">
              <ErreurChargement
                message="La liste des abonnés n’a pas pu être chargée."
                onReessayer={() => abonnes.refetch()}
              />
            </div>
          ) : (
            <TableauAdmin
              chargement={abonnes.isLoading}
              cleLigne={(a) => a.id}
              colonnes={COLONNES}
              lignes={abonnes.data?.data ?? []}
              vide={
                recherche
                  ? "Aucun numéro ne correspond."
                  : "Aucun abonné pour ce filtre."
              }
            />
          )}
          <PiedListe
            droite={
              <PaginationSimple
                derniere={meta?.last_page ?? 1}
                page={page}
                onChange={setPage}
              />
            }
            gauche={`${meta?.total ?? abonnes.data?.data?.length ?? 0} numéro(s) · masqués pour la confidentialité`}
          />
        </Carte>
      </ContenuAdmin>
    </>
  );
}
