"use client";

import type {
  ICreneauSaisie,
  IExceptionSaisie,
} from "../types/horaire-admin.type";

import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

import { horaireAPI } from "../apis/horaire.api";

import { useInvalidateHoraireQuery } from "./index.query";

import { messageErreur } from "@/components/admin/contenus/erreur-api";

const echec = (err: unknown) => toast.danger(messageErreur(err));

/** Enregistre les célébrations d'un jour : créations puis modifications. */
export const useEnregistrerJourMutation = () => {
  const invalider = useInvalidateHoraireQuery();

  return useMutation({
    mutationFn: async ({
      creations,
      modifications,
    }: {
      creations: ICreneauSaisie[];
      modifications: { id: number; data: Partial<ICreneauSaisie> }[];
    }) => {
      for (const c of creations) await horaireAPI.ajouterCreneau(c);
      for (const m of modifications)
        await horaireAPI.modifierCreneau(m.id, m.data);
    },
    onSuccess: () => toast.success("Horaires du jour enregistrés."),
    onError: echec,
    // Même en cas d'échec partiel, on recharge l'état réel du serveur.
    onSettled: () => invalider("creneaux"),
  });
};

export const useSupprimerCreneauMutation = () => {
  const invalider = useInvalidateHoraireQuery();

  return useMutation({
    mutationFn: (id: number) => horaireAPI.supprimerCreneau(id),
    onSuccess: async () => {
      await invalider("creneaux");
      toast.success("Célébration retirée de la semaine type.");
    },
    onError: echec,
  });
};

export const useEnregistrerExceptionMutation = () => {
  const invalider = useInvalidateHoraireQuery();

  return useMutation({
    mutationFn: ({ id, data }: { id?: number; data: IExceptionSaisie }) =>
      id
        ? horaireAPI.modifierException(id, data)
        : horaireAPI.ajouterException(data),
    onSuccess: async (_r, { id }) => {
      await invalider("exceptions");
      toast.success(id ? "Exception modifiée." : "Exception ajoutée.");
    },
    onError: echec,
  });
};

export const useSupprimerExceptionMutation = () => {
  const invalider = useInvalidateHoraireQuery();

  return useMutation({
    mutationFn: (id: number) => horaireAPI.supprimerException(id),
    onSuccess: async () => {
      await invalider("exceptions");
      toast.success("Exception supprimée.");
    },
    onError: echec,
  });
};
