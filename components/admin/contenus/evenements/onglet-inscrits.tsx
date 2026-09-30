"use client";

import type {
  IEvenementAdmin,
  IInscrit,
} from "@/features/evenement/types/evenement-admin.type";

import { toast } from "@heroui/react";
import { useState } from "react";

import { telephoneMasque } from "./utils";

import { dateCourte } from "@/components/admin/contenus/dates";
import { messageErreur } from "@/components/admin/contenus/erreur-api";
import {
  BoutonAdmin,
  ErreurChargement,
  TableauAdmin,
} from "@/components/admin/ui/kit";
import { telechargerExport } from "@/features/admin/apis/admin.api";
import { useInscritsQuery } from "@/features/evenement/queries/evenement-admin.query";

const personnes = (i: IInscrit) => Math.max(1, Number(i.attendees ?? 1));

/** CSV (UTF-8 avec BOM) construit à partir de la liste affichée. */
function exporterLocalement(inscrits: IInscrit[], nom: string) {
  const echapper = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lignes = [
    [
      "Nom",
      "WhatsApp",
      "E-mail",
      "Personnes",
      "Rappel",
      "Tarif",
      "Paiement",
      "Inscrit le",
    ],
    ...inscrits.map((i) => [
      i.fullname,
      i.phone,
      i.email,
      personnes(i),
      i.reminder == null ? "" : i.reminder ? "Oui" : "Non",
      i.tier_label,
      i.payment_status,
      i.created_at,
    ]),
  ];
  const csv = "﻿" + lignes.map((l) => l.map(echapper).join(";")).join("\r\n");
  const lien = document.createElement("a");

  lien.href = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  lien.download = nom;
  document.body.appendChild(lien);
  lien.click();
  lien.remove();
  URL.revokeObjectURL(lien.href);
}

/** Onglet « Inscrits » d'un événement. */
export function OngletInscrits({ evenement }: { evenement: IEvenementAdmin }) {
  const inscrits = useInscritsQuery(evenement.id);
  const [export_, setExport] = useState(false);
  const liste = inscrits.data ?? [];
  const nbInscriptions = evenement.registrations_count ?? liste.length;
  const nbPersonnes =
    evenement.attendees_count ?? liste.reduce((s, i) => s + personnes(i), 0);
  const nomFichier = `inscrits-${evenement.slug || evenement.id}.csv`;

  const exporter = async () => {
    setExport(true);
    try {
      await telechargerExport(
        `/events/${evenement.id}/participants/export`,
        nomFichier,
      );
    } catch (err) {
      const msg = (err as Error)?.message ?? "";

      if (/refusé/i.test(msg)) toast.danger(msg);
      else if (liste.length) {
        // Route d'export pas encore disponible : export de la liste chargée.
        exporterLocalement(liste, nomFichier);
      } else toast.danger(msg || "L’export a échoué.");
    } finally {
      setExport(false);
    }
  };

  return (
    <div className="flex flex-col gap-3.5 px-5 py-[18px] md:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <span className="text-[15px]">
          <strong>{nbInscriptions}</strong> inscription
          {nbInscriptions > 1 ? "s" : ""} · {nbPersonnes} personne
          {nbPersonnes > 1 ? "s" : ""}
          {evenement.max_participants
            ? ` · jauge ${evenement.max_participants}`
            : " · sans jauge"}
        </span>
        <div className="flex flex-wrap gap-2">
          <BoutonAdmin
            className="py-2.5"
            isDisabled={!liste.length}
            isPending={export_}
            variante="neutre"
            onPress={exporter}
          >
            Exporter (CSV)
          </BoutonAdmin>
          <span title="Disponible dès que WhatsApp Business sera configuré.">
            <BoutonAdmin isDisabled className="py-2.5" variante="marine">
              Envoyer un rappel WhatsApp
            </BoutonAdmin>
          </span>
        </div>
      </div>
      <p className="m-0 text-xs text-gris">
        Rappel WhatsApp disponible dès que WhatsApp Business sera configuré.
      </p>
      {inscrits.isError ? (
        <ErreurChargement
          message={`Les inscrits n’ont pas pu être chargés. ${messageErreur(inscrits.error)}`}
          onReessayer={() => inscrits.refetch()}
        />
      ) : (
        <div className="-mx-5 md:mx-0">
          <TableauAdmin
            chargement={inscrits.isLoading}
            cleLigne={(i) => i.id}
            colonnes={[
              {
                cle: "nom",
                titre: "Nom",
                className: "font-semibold",
                rendu: (i) => i.fullname,
              },
              {
                cle: "tel",
                titre: "WhatsApp",
                className: "whitespace-nowrap",
                rendu: (i) => telephoneMasque(i.phone),
              },
              { cle: "nb", titre: "Personnes", rendu: personnes },
              {
                cle: "rappel",
                titre: "Rappel",
                secondaire: true,
                rendu: (i) =>
                  i.reminder == null ? "—" : i.reminder ? "Oui" : "Non",
              },
              {
                cle: "date",
                titre: "Inscrit le",
                secondaire: true,
                className: "whitespace-nowrap text-gris",
                rendu: (i) => dateCourte(i.created_at),
              },
            ]}
            lignes={liste}
            vide="Aucune inscription pour le moment."
          />
        </div>
      )}
    </div>
  );
}
