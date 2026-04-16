"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IMesseCreer } from "../types/messe.type";
import { messeAPI } from "../apis/messe.api";
import { useInvalidateMesseQuery } from "./index.query";

export const useAjouterMesseMutation = () => {
  const invalidate = useInvalidateMesseQuery();
  return useMutation({
    mutationFn: async ({ data }: { data: IMesseCreer }) =>
      messeAPI.ajouter(data),
    onSuccess: async () => {
      invalidate();
      toast.success("Messe ajoutee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
