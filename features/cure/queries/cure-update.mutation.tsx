"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { ICure } from "../types/cure.type";
import { cureAPI } from "../apis/cure.api";
import { useInvalidateCureQuery } from "./index.query";

export const useModifierCureMutation = () => {
  const invalidate = useInvalidateCureQuery();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: FormData | Partial<ICure> }) =>
      cureAPI.modifier(id, data),
    onSuccess: async () => {
      invalidate();
      toast.success("Cure modifie");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
