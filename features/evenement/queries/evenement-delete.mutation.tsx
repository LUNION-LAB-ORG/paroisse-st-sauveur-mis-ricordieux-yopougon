"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { evenementAPI } from "../apis/evenement.api";
import { useInvalidateEvenementQuery } from "./index.query";

export const useSupprimerEvenementMutation = () => {
  const invalidate = useInvalidateEvenementQuery();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => evenementAPI.supprimer(id),
    onSuccess: async () => {
      invalidate();
      toast.success("Evenement supprime");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
