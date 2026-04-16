"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IActualiteModifier } from "../types/actualite.type";
import { actualiteAPI } from "../apis/actualite.api";
import { useInvalidateActualiteQuery } from "./index.query";

export const useModifierActualiteMutation = () => {
  const invalidate = useInvalidateActualiteQuery();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData | IActualiteModifier }) =>
      actualiteAPI.modifier(id, data),
    onSuccess: async () => {
      invalidate();
      toast.success("Actualite modifiee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
