"use client";

import { Printer } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  BoutonAdmin,
  Carte,
  ChampTexteAdmin,
  ContenuAdmin,
  EnTeteAdmin,
  ErreurChargement,
  EtatVide,
} from "@/components/admin/ui/kit";
import { useListeCelebrantQuery } from "@/features/messe/queries/messe-admin.query";
import { dateDuJour, dateLongue, heureCourte } from "@/lib/charte";

/** Styles d'impression : seule la liste est imprimée, sans menu ni en-tête. */
const IMPRESSION = `
@media print {
  @page { margin: 16mm; }
  body * { visibility: hidden !important; }
  #liste-celebrant, #liste-celebrant * { visibility: visible !important; }
  #liste-celebrant { position: absolute; inset: 0 auto auto 0; width: 100%; border: 0 !important; }
  #liste-celebrant .saut { break-inside: avoid; }
}`;

const CONFIDENTIELLE = "Intention confidentielle";

/**
 * Liste imprimable des intentions du jour, groupées par messe. Les intentions
 * confidentielles ne sont jamais nominatives (le serveur remplace le nom).
 */
export function ListeCelebrant() {
  const params = useSearchParams();
  const router = useRouter();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(params.get("date") ?? "")
    ? params.get("date")!
    : dateDuJour();
  const requete = useListeCelebrantQuery(date);
  const creneaux = (requete.data?.data ?? []).filter(
    (c) => c.intentions.length > 0,
  );
  const total = creneaux.reduce((n, c) => n + c.intentions.length, 0);

  return (
    <>
      <style>{IMPRESSION}</style>
      <EnTeteAdmin
        actions={
          <>
            <BoutonAdmin href="/dashboard/messes" variante="neutre">
              Retour aux demandes
            </BoutonAdmin>
            <BoutonAdmin
              isDisabled={!total}
              variante="marine"
              onPress={() => window.print()}
            >
              <Printer aria-hidden className="size-4" />
              Imprimer
            </BoutonAdmin>
          </>
        }
        sousTitre="Intentions à lire à chaque messe du jour"
        titre="Liste du célébrant"
      />
      <ContenuAdmin>
        <div className="max-w-[260px]">
          <ChampTexteAdmin
            label="Date"
            type="date"
            value={date}
            onChange={(v) =>
              v && router.replace(`/dashboard/messes/celebrant?date=${v}`)
            }
          />
        </div>
        {requete.isError ? (
          <ErreurChargement
            message="La liste du célébrant n’a pas pu être chargée."
            onReessayer={() => requete.refetch()}
          />
        ) : (
          <Carte
            className="max-w-[820px]"
            corpsClassName="flex flex-col gap-6 p-5 md:p-8"
          >
            <div className="flex flex-col gap-6" id="liste-celebrant">
              <div className="flex flex-col gap-1 border-b-2 border-marine pb-3">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-gris">
                  Paroisse Saint Sauveur Miséricordieux
                </span>
                <h2 className="m-0 font-heading text-xl font-extrabold text-marine">
                  Intentions de messe · {dateLongue(date)}
                </h2>
                <span className="text-sm text-gris">
                  {requete.isLoading ? "Chargement…" : `${total} intention(s)`}
                </span>
              </div>
              {!requete.isLoading && creneaux.length === 0 && (
                <EtatVide>Aucune intention pour cette date.</EtatVide>
              )}
              {creneaux.map((c) => (
                <section
                  key={`${c.time}-${c.label}`}
                  className="saut flex flex-col gap-2"
                >
                  <h3 className="m-0 font-heading text-base font-extrabold text-marine">
                    {heureCourte(c.time)}
                    {c.label ? ` · ${c.label}` : ""}
                  </h3>
                  <ol className="m-0 flex list-decimal flex-col gap-2 pl-5 text-[15px] leading-[1.5]">
                    {c.intentions.map((i, k) => {
                      const confidentielle =
                        !i.for_whom || i.for_whom === CONFIDENTIELLE;

                      return (
                        <li key={i.number ?? k}>
                          <span className="font-semibold">
                            {i.intention_type ?? "Intention"}
                          </span>
                          {" — "}
                          {confidentielle ? (
                            <em className="text-gris">{CONFIDENTIELLE}</em>
                          ) : (
                            i.for_whom
                          )}
                          {!confidentielle && i.intention && (
                            <span className="block text-sm text-encre-douce">
                              {i.intention}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </section>
              ))}
            </div>
          </Carte>
        )}
      </ContenuAdmin>
    </>
  );
}
