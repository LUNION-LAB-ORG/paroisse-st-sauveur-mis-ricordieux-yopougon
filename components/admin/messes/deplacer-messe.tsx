"use client";

import type { IDemandeMesseAdmin } from "@/features/messe/types/messe-admin.type";

import { useState } from "react";

import { ChoixCreneau } from "./choix-creneau";
import { numeroDemande } from "./libelles";

import { FenetreAdmin } from "@/components/admin/demandes/elements";
import { BoutonAdmin, ChampChoixAdmin } from "@/components/admin/ui/kit";
import {
  useDeplacerMesseMutation,
  useDisponibilitesMesseQuery,
} from "@/features/messe/queries/messe-admin.query";
import { dateDuJour, dateSansAnnee, heureCourte } from "@/lib/charte";

/** « Déplacer la date » : choisit une messe programmée puis un nouveau créneau. */
export function DeplacerMesse({
  demande,
  onFermer,
}: {
  demande: IDemandeMesseAdmin | null;
  onFermer: () => void;
}) {
  const programmees = demande?.schedules ?? [];
  const [choix, setChoix] = useState<string>("");
  const [date, setDate] = useState("");
  const [creneau, setCreneau] = useState<number | null>(null);
  const [erreur, setErreur] = useState("");
  const dispo = useDisponibilitesMesseQuery(dateDuJour(), !!demande);
  const deplacer = useDeplacerMesseMutation();
  const scheduleId = Number(
    choix || (programmees.length === 1 ? programmees[0].id : 0),
  );

  const fermer = () => {
    setChoix("");
    setDate("");
    setCreneau(null);
    setErreur("");
    onFermer();
  };

  const envoyer = () => {
    if (!scheduleId) return setErreur("Choisissez la messe à déplacer.");
    if (!date || !creneau) return setErreur("Choisissez la nouvelle messe.");
    deplacer.mutate(
      { scheduleId, data: { date, time_slot_id: creneau } },
      { onSuccess: fermer },
    );
  };

  return (
    <FenetreAdmin
      ouverte={!!demande}
      pied={
        <>
          <BoutonAdmin variante="neutre" onPress={fermer}>
            Annuler
          </BoutonAdmin>
          <BoutonAdmin
            isPending={deplacer.isPending}
            variante="marine"
            onPress={envoyer}
          >
            Déplacer
          </BoutonAdmin>
        </>
      }
      sousTitre={demande ? numeroDemande(demande) : undefined}
      titre="Déplacer la date"
      onFermer={fermer}
    >
      {programmees.length === 0 ? (
        <p className="m-0 text-sm text-gris">
          Cette demande n’a pas de messe programmée à déplacer.
        </p>
      ) : (
        <>
          {programmees.length > 1 && (
            <ChampChoixAdmin
              erreur={!scheduleId ? erreur : undefined}
              label="Messe à déplacer"
              options={programmees.map((s) => ({
                valeur: String(s.id),
                label: `${dateSansAnnee(s.date)} · ${heureCourte(s.time)}${s.shifted ? " (décalée)" : ""}`,
              }))}
              placeholder="Choisir"
              value={choix}
              onChange={(v) => {
                setChoix(v);
                setErreur("");
              }}
            />
          )}
          {programmees.length === 1 && (
            <p className="m-0 text-sm">
              Messe actuelle :{" "}
              <strong>
                {dateSansAnnee(programmees[0].date)} ·{" "}
                {heureCourte(programmees[0].time)}
              </strong>
            </p>
          )}
          <ChoixCreneau
            chargement={dispo.isLoading}
            creneau={creneau}
            date={date}
            dispo={dispo.data?.data}
            erreur={scheduleId ? erreur : undefined}
            erreurChargement={dispo.isError}
            onChange={(d, c) => {
              setDate(d);
              setCreneau(c);
              setErreur("");
            }}
          />
        </>
      )}
    </FenetreAdmin>
  );
}
