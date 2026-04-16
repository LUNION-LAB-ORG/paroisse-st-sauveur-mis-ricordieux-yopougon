"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IEcouteCreer } from "../types/ecoute.type";
import { ecouteAPI } from "../apis/ecoute.api";
import { useInvalidateEcouteQuery } from "./index.query";

export const useAjouterEcouteMutation = () => {
  const invalidate = useInvalidateEcouteQuery();
  return useMutation({
    mutationFn: async ({ data }: { data: IEcouteCreer }) =>
      ecouteAPI.ajouter(data),
    onSuccess: async () => {
      invalidate();
      toast.success("Demande d'ecoute ajoutee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
