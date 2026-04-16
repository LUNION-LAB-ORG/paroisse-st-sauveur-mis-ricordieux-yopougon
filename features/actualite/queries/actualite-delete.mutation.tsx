"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { actualiteAPI } from "../apis/actualite.api";
import { useInvalidateActualiteQuery } from "./index.query";

export const useSupprimerActualiteMutation = () => {
  const invalidate = useInvalidateActualiteQuery();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => actualiteAPI.supprimer(id),
    onSuccess: async () => {
      invalidate();
      toast.success("Actualite supprimee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
