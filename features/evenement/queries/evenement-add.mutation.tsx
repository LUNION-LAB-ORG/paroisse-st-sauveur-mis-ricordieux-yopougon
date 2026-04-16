"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IEvenement } from "../types/evenement.type";
import { evenementAPI } from "../apis/evenement.api";
import { useInvalidateEvenementQuery } from "./index.query";

export const useAjouterEvenementMutation = () => {
  const invalidate = useInvalidateEvenementQuery();
  return useMutation({
    mutationFn: async ({ data }: { data: FormData | Partial<IEvenement> }) =>
      evenementAPI.ajouter(data),
    onSuccess: async () => {
      invalidate();
      toast.success("Evenement ajoute");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
