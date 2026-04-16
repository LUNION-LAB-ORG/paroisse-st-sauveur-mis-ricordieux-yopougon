"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IEvenement } from "../types/evenement.type";
import { evenementAPI } from "../apis/evenement.api";
import { useInvalidateEvenementQuery } from "./index.query";

export const useModifierEvenementMutation = () => {
  const invalidate = useInvalidateEvenementQuery();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData | Partial<IEvenement> }) =>
      evenementAPI.modifier(id, data),
    onSuccess: async () => {
      invalidate();
      toast.success("Evenement modifie");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
