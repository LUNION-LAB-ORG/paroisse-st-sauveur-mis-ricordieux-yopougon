"use client";

import type { TonPastille } from "@/components/admin/ui/kit";
import type { IAnnonce } from "@/features/annonce/types/annonce.type";

import { toast } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

import { FicheAnnonce } from "./fiche-annonce";

import {
  isoJour,
  jourMois,
  libelleSemaine,
  lundiDe,
} from "@/components/admin/contenus/dates";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { LectureSeule } from "@/components/admin/contenus/mise-en-page";
import {
  BoutonAdmin,
  Carte,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  GrilleListeFiche,
  Pastille,
  TableauAdmin,
} from "@/components/admin/ui/kit";
import { useDroits } from "@/features/admin/hooks/use-droits";
import { useDeposerFeuilleMutation } from "@/features/annonce/queries/annonce-admin.mutation";
import {
  useAnnoncesAdminQuery,
  useFeuilleAnnoncesQuery,
} from "@/features/annonce/queries/annonce-admin.query";

export function statutAnnonce(a: IAnnonce): {
  label: string;
  ton: TonPastille;
} {
  const auj = isoJour();

  if (a.status === "draft") return { label: "Brouillon", ton: "neutre" };
  if (a.status === "hidden") return { label: "Masquée", ton: "neutre" };
  if (a.visible_from && a.visible_from.slice(0, 10) > auj)
    return { label: "Programmée", ton: "info" };
  if (a.visible_until && a.visible_until.slice(0, 10) < auj)
    return { label: "Expirée", ton: "neutre" };

  return { label: "Publiée", ton: "succes" };
}

function visibilite(a: IAnnonce): string {
  const du = a.visible_from ? jourMois(a.visible_from) : null;
  const au = a.visible_until ? jourMois(a.visible_until) : null;

  if (du && au) return `${du} – ${au}`;
  if (du) return `Dès le ${du}`;
  if (au) return `Jusqu’au ${au}`;

  return "Sans limite";
}

/** Écran « Annonces ». */
export function EcranAnnonces() {
  const peutEcrire = useDroits().peutModifier("annonces");
  const annonces = useAnnoncesAdminQuery();
  const feuille = useFeuilleAnnoncesQuery();
  const deposer = useDeposerFeuilleMutation();
  const [choisi, setChoisi] = useState<number | "nouvelle" | null>(null);
  const entreePdf = useRef<HTMLInputElement>(null);
  const fiche = useRef<HTMLDivElement>(null);

  const liste = annonces.data ?? [];
  const courante =
    choisi === "nouvelle" ? null : (liste.find((a) => a.id === choisi) ?? null);

  // Première annonce choisie par défaut
  useEffect(() => {
    if (choisi === null && liste.length) setChoisi(liste[0].id);
  }, [choisi, liste]);

  const montrerFiche = (v: number | "nouvelle") => {
    setChoisi(v);
    if (typeof window !== "undefined" && window.innerWidth < 1280)
      requestAnimationFrame(() =>
        fiche.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
  };

  // « + Nouveau contenu › Annonce » du tableau de bord : /dashboard/annonces?nouvelle=1
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("nouvelle")) montrerFiche("nouvelle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <EnTeteAdmin
        actions={
          <>
            {feuille.data && (
              <BoutonAdmin cible="_blank" href={feuille.data} variante="lien">
                Feuille actuelle
              </BoutonAdmin>
            )}
            {peutEcrire && (
              <>
                <BoutonAdmin
                  isPending={deposer.isPending}
                  variante="contour"
                  onPress={() => entreePdf.current?.click()}
                >
                  Déposer la feuille d’annonces (PDF)
                </BoutonAdmin>
                <input
                  ref={entreePdf}
                  accept="application/pdf,.pdf"
                  className="sr-only"
                  tabIndex={-1}
                  type="file"
                  onChange={(e) => {
                    const f = e.target.files?.[0];

                    e.target.value = "";
                    if (!f) return;
                    if (f.type && f.type !== "application/pdf") {
                      toast.danger("Choisissez un fichier PDF.");

                      return;
                    }
                    if (f.size > 10 * 1024 * 1024) {
                      toast.danger("Le PDF dépasse 10 Mo.");

                      return;
                    }
                    deposer.mutate(f);
                  }}
                />
                <BoutonAdmin
                  variante="primaire"
                  onPress={() => montrerFiche("nouvelle")}
                >
                  + Nouvelle annonce
                </BoutonAdmin>
              </>
            )}
          </>
        }
        sousTitre={libelleSemaine(lundiDe(isoJour()))}
        titre="Annonces"
      />
      <ContenuAdmin>
        <LectureSeule visible={!peutEcrire} />
        {annonces.isError && (
          <ErreurChargement
            message={`Les annonces n’ont pas pu être chargées. ${messageErreur(annonces.error)}`}
            onReessayer={() => annonces.refetch()}
          />
        )}
        <GrilleListeFiche
          fiche={
            <div ref={fiche} className="scroll-mt-4">
              {choisi !== null && (choisi === "nouvelle" || courante) ? (
                <FicheAnnonce
                  key={choisi === "nouvelle" ? "nouvelle" : `${courante?.id}`}
                  annonce={courante}
                  peutEcrire={peutEcrire}
                  onCree={(id) => setChoisi(id)}
                  onSupprimee={() => setChoisi(null)}
                />
              ) : (
                !annonces.isLoading &&
                !annonces.isError && (
                  <Carte accent className="p-[22px] text-sm text-gris">
                    {peutEcrire
                      ? "Choisissez une annonce ou créez-en une nouvelle."
                      : "Choisissez une annonce pour la consulter."}
                  </Carte>
                )
              )}
            </div>
          }
          largeurFiche={460}
          liste={
            <Carte className="self-start overflow-hidden">
              <TableauAdmin
                chargement={annonces.isLoading}
                cleLigne={(a) => a.id}
                colonnes={[
                  {
                    cle: "titre",
                    titre: "Annonce",
                    rendu: (a) => (
                      <span className="flex flex-col gap-0.5">
                        <span className="font-bold">{a.title}</span>
                        {a.is_featured && (
                          <span className="text-xs font-bold text-rouge">
                            À la une
                          </span>
                        )}
                      </span>
                    ),
                  },
                  {
                    cle: "categorie",
                    titre: "Catégorie",
                    secondaire: true,
                    rendu: (a) => a.category || "—",
                  },
                  {
                    cle: "visible",
                    titre: "Visible",
                    secondaire: true,
                    className: "whitespace-nowrap text-gris",
                    rendu: visibilite,
                  },
                  {
                    cle: "statut",
                    titre: "Statut",
                    rendu: (a) => {
                      const s = statutAnnonce(a);

                      return <Pastille ton={s.ton}>{s.label}</Pastille>;
                    },
                  },
                ]}
                lignes={liste}
                selection={typeof choisi === "number" ? choisi : null}
                vide="Aucune annonce pour le moment."
                onChoisir={(a) => montrerFiche(a.id)}
              />
            </Carte>
          }
        />
      </ContenuAdmin>
    </>
  );
}
