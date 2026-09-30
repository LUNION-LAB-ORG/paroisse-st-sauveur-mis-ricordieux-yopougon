"use client";

import type {
  IHomelieAdmin,
  IHomelieSaisie,
} from "../types/liturgie-admin.type";

import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

import { liturgieAPI } from "../apis/liturgie.api";

import { useInvalidateLiturgieQuery } from "./index.query";

import { messageErreur } from "@/components/admin/contenus/erreur-api";

const echec = (err: unknown) => toast.danger(messageErreur(err));

export const useImporterLiturgieMutation = () => {
  const invalider = useInvalidateLiturgieQuery();

  return useMutation({
    mutationFn: ({ date, days }: { date: string; days: number }) =>
      liturgieAPI.importer(date, days),
    onSuccess: async (res) => {
      await invalider("jours");
      const { imported = [], failed = [] } = res?.data ?? {};

      if (failed.length)
        toast.warning(
          `Import partiel : ${imported.length} jour(s) importé(s), ${failed.length} en échec.`,
        );
      else toast.success(`Textes AELF importés : ${imported.length} jour(s).`);
    },
    onError: echec,
  });
};

export const useSurchargerLiturgieMutation = () => {
  const invalider = useInvalidateLiturgieQuery();

  return useMutation({
    mutationFn: ({
      date,
      feast_override,
      color_override,
    }: {
      date: string;
      feast_override: string | null;
      color_override: string | null;
    }) => liturgieAPI.surcharger(date, { feast_override, color_override }),
    onSuccess: async () => {
      await invalider("jours");
      toast.success("Surcharge locale enregistrée.");
    },
    onError: echec,
  });
};

/** Création ou mise à jour d'une homélie, puis envoi de l'audio éventuel. */
export const useEnregistrerHomelieMutation = () => {
  const invalider = useInvalidateLiturgieQuery();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      audio,
    }: {
      id?: number;
      data: IHomelieSaisie;
      audio?: File | null;
    }): Promise<{ homelie: IHomelieAdmin; erreurAudio?: string }> => {
      const res = id
        ? await liturgieAPI.modifierHomelie(id, data)
        : await liturgieAPI.ajouterHomelie(data);
      let homelie = res.data;
      let erreurAudio: string | undefined;

      if (audio && homelie?.id) {
        try {
          homelie =
            (await liturgieAPI.envoyerAudio(homelie.id, audio)).data ?? homelie;
        } catch (err) {
          erreurAudio = messageErreur(err);
        }
      }

      return { homelie, erreurAudio };
    },
    onSuccess: async ({ erreurAudio }, { data }) => {
      await invalider("homelies");
      toast.success(
        data.status === "draft"
          ? "Brouillon de l’homélie enregistré."
          : data.publish_at &&
              new Date(`${data.publish_at.replace(" ", "T")}Z`).getTime() >
                Date.now()
            ? "Publication de l’homélie planifiée."
            : "Homélie publiée.",
      );
      if (erreurAudio)
        toast.danger(
          `L’enregistrement audio n’a pas été envoyé : ${erreurAudio}`,
        );
    },
    onError: echec,
  });
};

export const useSupprimerHomelieMutation = () => {
  const invalider = useInvalidateLiturgieQuery();

  return useMutation({
    mutationFn: (id: number) => liturgieAPI.supprimerHomelie(id),
    onSuccess: async () => {
      await invalider("homelies");
      toast.success("Homélie supprimée.");
    },
    onError: echec,
  });
};
