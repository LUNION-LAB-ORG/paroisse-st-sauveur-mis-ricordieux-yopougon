"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { ecouteAPI } from "../apis/ecoute.api";
import { useInvalidateEcouteQuery } from "./index.query";

export const useSupprimerEcouteMutation = () => {
  const invalidate = useInvalidateEcouteQuery();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => ecouteAPI.supprimer(id),
    onSuccess: async () => {
      invalidate();
      toast.success("Demande d'ecoute supprimee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
