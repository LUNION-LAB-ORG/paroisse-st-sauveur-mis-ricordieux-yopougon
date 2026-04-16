"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { participantAPI } from "../apis/participant.api";
import { useInvalidateParticipantQuery } from "./index.query";
import type { IParticipantCreer } from "../types/participant.type";

export const useParticipantAddMutation = () => {
  const invalidate = useInvalidateParticipantQuery();

  return useMutation({
    mutationFn: (data: IParticipantCreer) => participantAPI.ajouter(data),
    onSuccess: async () => {
      toast.success("Inscription enregistree avec succes");
      await invalidate();
    },
    onError: () => {
      toast.error("Erreur lors de l'inscription");
    },
  });
};
