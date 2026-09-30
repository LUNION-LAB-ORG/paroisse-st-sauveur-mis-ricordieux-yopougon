"use client";

import type { IJalonSaisie } from "../apis/histoire.api";

import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

import { histoireAPI } from "../apis/histoire.api";

import { useInvalidateHistoireQuery } from "./index.query";

import { messageErreur } from "@/components/admin/contenus/erreur-api";
import { settingAPI } from "@/features/setting/apis/setting.api";

const echec = (err: unknown) => toast.danger(messageErreur(err));

export interface IEnregistrementHistoire {
  /** Jalons dans l'ordre affiché (id absent = nouveau) */
  jalons: (IJalonSaisie & { id?: number; modifie: boolean })[];
  ordreModifie: boolean;
  /** Jalons retirés de la liste */
  supprimes: number[];
  parametres: { key: string; value: string | null }[];
}

/** Enregistre les jalons (créations, modifications, ordre) puis les textes. */
export const useEnregistrerHistoireMutation = () => {
  const invalider = useInvalidateHistoireQuery();

  return useMutation({
    mutationFn: async ({
      jalons,
      ordreModifie,
      supprimes,
      parametres,
    }: IEnregistrementHistoire) => {
      for (const id of supprimes) await histoireAPI.supprimer(id);
      const ids: number[] = [];
      let crees = false;

      for (let i = 0; i < jalons.length; i++) {
        const j = jalons[i];

        if (!j.id) {
          const r = await histoireAPI.ajouter({
            year: j.year,
            title: j.title,
            sort_order: i,
            status: "published",
          });

          ids.push(r.data.id);
          crees = true;
        } else {
          if (j.modifie)
            await histoireAPI.modifier(j.id, { year: j.year, title: j.title });
          ids.push(j.id);
        }
      }
      if ((ordreModifie || crees) && ids.length)
        await histoireAPI.reordonner(ids);
      if (parametres.length) await settingAPI.modifier(parametres);
    },
    onSuccess: () => toast.success("Histoire et mot du curé enregistrés."),
    onError: echec,
    onSettled: () => invalider(),
  });
};

export const useChangerPortraitMutation = () => {
  const invalider = useInvalidateHistoireQuery();

  return useMutation({
    mutationFn: (f: File) => settingAPI.uploadImage("pastor_word.photo", f),
    onSuccess: async () => {
      await invalider("parametres");
      toast.success("Portrait du curé mis à jour.");
    },
    onError: echec,
  });
};
