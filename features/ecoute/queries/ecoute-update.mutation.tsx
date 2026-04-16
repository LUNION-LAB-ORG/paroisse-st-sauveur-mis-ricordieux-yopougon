"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IEcouteModifier } from "../types/ecoute.type";
import { ecouteAPI } from "../apis/ecoute.api";
import { useInvalidateEcouteQuery } from "./index.query";

export const useModifierEcouteMutation = () => {
  const invalidate = useInvalidateEcouteQuery();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: IEcouteModifier }) =>
      ecouteAPI.modifier(id, data),
    onSuccess: async () => {
      invalidate();
      toast.success("Demande d'ecoute modifiee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
