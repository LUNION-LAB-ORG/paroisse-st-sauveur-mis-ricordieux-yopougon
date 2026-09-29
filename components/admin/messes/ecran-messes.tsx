"use client";

import type { IDemandeMesseAdmin } from "@/features/messe/types/messe-admin.type";

import { toast } from "@heroui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { DeplacerMesse } from "./deplacer-messe";
import { FicheMesse } from "./fiche-messe";
import {
  FILTRES_MESSES,
  FORMULES,
  type IFiltreEcran,
  intentionDe,
  numeroDemande,
  pourQui,
  premiereMesse,
  statutPaiement,
} from "./libelles";
import { SaisieMesse } from "./saisie-messe";

import {
  ChampRecherche,
  PaginationSimple,
} from "@/components/admin/demandes/elements";
import {
  BoutonAdmin,
  Carte,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  EtatVide,
  Filtres,
  GrilleListeFiche,
  type IColonne,
  Pastille,
  PiedListe,
  TableauAdmin,
} from "@/components/admin/ui/kit";
import { telechargerExport } from "@/features/admin/apis/admin.api";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { useMessesAdminQuery } from "@/features/messe/queries/messe-admin.query";
import { dateDuJour, formatMontant } from "@/lib/charte";

const COLONNES: IColonne<IDemandeMesseAdmin>[] = [
  {
    cle: "numero",
    titre: "N°",
    rendu: (d) => (
      <span className="whitespace-nowrap font-bold text-marine">
        {numeroDemande(d)}
      </span>
    ),
  },
  {
    cle: "messe",
    titre: "Messe",
    rendu: (d) => <span className="whitespace-nowrap">{premiereMesse(d)}</span>,
  },
  {
    cle: "intention",
    titre: "Intention",
    rendu: intentionDe,
    secondaire: true,
  },
  { cle: "pour", titre: "Pour", rendu: pourQui, secondaire: true },
  {
    cle: "formule",
    titre: "Formule",
    rendu: (d) => (
      <span className="whitespace-nowrap">
        {FORMULES[d.formula]?.label ?? "Une messe"}
      </span>
    ),
    secondaire: true,
  },
  {
    cle: "offrande",
    titre: "Offrande",
    rendu: (d) => (
      <span className="whitespace-nowrap">{formatMontant(d.amount)} FCFA</span>
    ),
    secondaire: true,
  },
  {
    cle: "paiement",
    titre: "Paiement",
    rendu: (d) => {
      const s = statutPaiement(d);

      return <Pastille ton={s.ton}>{s.label}</Pastille>;
    },
  },
];

export function EcranMesses() {
  const droits = useDroits();
  const peutModifier = droits.peutModifier("messes");
  const params = useSearchParams();
  const initial = FILTRES_MESSES.some((f) => f.valeur === params.get("filtre"))
    ? (params.get("filtre") as IFiltreEcran)
    : "all";
  const [filtre, setFiltre] = useState<IFiltreEcran>(initial);
  const [saisie, setSaisie] = useState("");
  const [recherche, setRecherche] = useState("");
  const [page, setPage] = useState(1);
  const [choisie, setChoisie] = useState<number | null>(null);
  const [aDeplacer, setADeplacer] = useState<IDemandeMesseAdmin | null>(null);
  const [saisieOuverte, setSaisieOuverte] = useState(false);
  const [exportEnCours, setExportEnCours] = useState(false);
  const refFiche = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setRecherche(saisie.trim());
      setPage(1);
    }, 300);

    return () => clearTimeout(t);
  }, [saisie]);

  const requete = useMessesAdminQuery({
    status: filtre === "today" ? "all" : filtre,
    date: filtre === "today" ? dateDuJour() : undefined,
    q: recherche || undefined,
    page,
  });
  const lignes = requete.data?.data ?? [];
  const meta = requete.data?.meta;
  const fiche = lignes.find((l) => l.id === choisie) ?? lignes[0] ?? null;

  const choisir = (d: IDemandeMesseAdmin) => {
    setChoisie(d.id);
    if (window.matchMedia("(max-width: 1279px)").matches)
      refFiche.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const exporter = async () => {
    setExportEnCours(true);
    try {
      await telechargerExport(
        "/messes/export",
        `demandes-de-messe-${dateDuJour()}.csv`,
        { status: filtre === "today" ? "all" : filtre },
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
          <>
            <BoutonAdmin
              isPending={exportEnCours}
              variante="neutre"
              onPress={exporter}
            >
              Exporter (CSV)
            </BoutonAdmin>
            <BoutonAdmin
              href={`/dashboard/messes/celebrant?date=${dateDuJour()}`}
              variante="contour"
            >
              Imprimer la liste du célébrant
            </BoutonAdmin>
            {peutModifier && (
              <BoutonAdmin
                variante="primaire"
                onPress={() => setSaisieOuverte(true)}
              >
                + Saisir une demande
              </BoutonAdmin>
            )}
          </>
        }
        sousTitre="Reçues en ligne ou saisies au secrétariat"
        titre="Demandes de messe"
      />
      <ContenuAdmin>
        <GrilleListeFiche
          fiche={
            <div ref={refFiche} className="scroll-mt-4 self-start">
              {fiche ? (
                <FicheMesse
                  demande={fiche}
                  peutModifier={peutModifier}
                  onDeplacer={() => setADeplacer(fiche)}
                />
              ) : (
                !requete.isLoading &&
                !requete.isError && (
                  <Carte accent as="aside">
                    <EtatVide>
                      Sélectionnez une demande pour ouvrir sa fiche.
                    </EtatVide>
                  </Carte>
                )
              )}
            </div>
          }
          liste={
            <Carte
              className="flex min-w-0 flex-col"
              corpsClassName="flex flex-1 flex-col"
            >
              <div className="flex flex-col gap-3 border-b border-bord-admin px-4 py-3.5 md:flex-row md:items-center md:justify-between md:px-5">
                <Filtres
                  label="Filtrer les demandes"
                  options={FILTRES_MESSES.filter(
                    (f) => f.valeur !== "to_process" || filtre === "to_process",
                  )}
                  valeur={filtre}
                  onChange={(v) => {
                    setFiltre(v);
                    setPage(1);
                  }}
                />
                <ChampRecherche
                  placeholder="Rechercher un nom, un numéro…"
                  valeur={saisie}
                  onChange={setSaisie}
                />
              </div>
              {requete.isError ? (
                <div className="p-5">
                  <ErreurChargement
                    message="Les demandes de messe n’ont pas pu être chargées."
                    onReessayer={() => requete.refetch()}
                  />
                </div>
              ) : (
                <TableauAdmin
                  chargement={requete.isLoading}
                  cleLigne={(d) => d.id}
                  colonnes={COLONNES}
                  lignes={lignes}
                  selection={fiche?.id ?? null}
                  vide={
                    recherche
                      ? `Aucune demande ne correspond à « ${recherche} ».`
                      : "Aucune demande de messe pour ce filtre."
                  }
                  onChoisir={choisir}
                />
              )}
              <PiedListe
                droite={
                  (meta?.last_page ?? 1) > 1 ? (
                    <PaginationSimple
                      derniere={meta?.last_page ?? 1}
                      page={page}
                      onChange={setPage}
                    />
                  ) : (
                    "Cliquez sur une ligne pour ouvrir la fiche"
                  )
                }
                gauche={`${meta?.total ?? lignes.length} demande(s) affichée(s)`}
              />
            </Carte>
          }
        />
      </ContenuAdmin>
      <SaisieMesse
        ouverte={saisieOuverte}
        onFermer={() => setSaisieOuverte(false)}
      />
      <DeplacerMesse demande={aDeplacer} onFermer={() => setADeplacer(null)} />
    </>
  );
}
