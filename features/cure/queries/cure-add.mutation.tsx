"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { ICure } from "../types/cure.type";
import { cureAPI } from "../apis/cure.api";
import { useInvalidateCureQuery } from "./index.query";

export const useAjouterCureMutation = () => {
  const invalidate = useInvalidateCureQuery();
  return useMutation({
    mutationFn: async ({ data }: { data: FormData | Partial<ICure> }) =>
      cureAPI.ajouter(data),
    onSuccess: async () => {
      invalidate();
      toast.success("Cure ajoute");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
