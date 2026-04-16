"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IActualiteCreer } from "../types/actualite.type";
import { actualiteAPI } from "../apis/actualite.api";
import { useInvalidateActualiteQuery } from "./index.query";

export const useAjouterActualiteMutation = () => {
  const invalidate = useInvalidateActualiteQuery();
  return useMutation({
    mutationFn: async ({ data }: { data: FormData | IActualiteCreer }) =>
      actualiteAPI.ajouter(data),
    onSuccess: async () => {
      invalidate();
      toast.success("Actualite ajoutee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
