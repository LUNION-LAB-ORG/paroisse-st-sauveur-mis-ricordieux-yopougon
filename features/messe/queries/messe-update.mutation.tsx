"use client";
import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import type { IMesseModifier } from "../types/messe.type";
import { messeAPI } from "../apis/messe.api";
import { useInvalidateMesseQuery } from "./index.query";

export const useModifierMesseMutation = () => {
  const invalidate = useInvalidateMesseQuery();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: IMesseModifier }) =>
      messeAPI.modifier(id, data),
    onSuccess: async () => {
      invalidate();
      toast.success("Messe modifiee");
    },
    onError: (error: Error) => {
      toast.danger(error.message);
    },
  });
};
