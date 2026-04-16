"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { messeAPI } from "../apis/messe.api";
import { useInvalidateMesseQuery } from "./index.query";

export const useSupprimerMesseMutation = () => {
  const invalidate = useInvalidateMesseQuery();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => messeAPI.supprimer(id),
    onSuccess: async () => {
      invalidate();
      toast.success("Messe supprimee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
