"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { cureAPI } from "../apis/cure.api";
import { useInvalidateCureQuery } from "./index.query";

export const useSupprimerCureMutation = () => {
  const invalidate = useInvalidateCureQuery();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => cureAPI.supprimer(id),
    onSuccess: async () => {
      invalidate();
      toast.success("Cure supprime");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
