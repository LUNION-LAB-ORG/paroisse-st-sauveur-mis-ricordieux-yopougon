"use client";
import type { AbonnementDTO } from "../schemas/abonnement.schema";

import { toast } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";

import { abonnementAPI } from "../apis/abonnement.api";

export const useAbonnerWhatsappMutation = () =>
  useMutation({
    mutationFn: async (data: AbonnementDTO) => abonnementAPI.abonner(data),
    onSuccess: () => {
      toast.success(
        "Abonnement enregistré. Vous recevrez la Parole du jour sur WhatsApp.",
      );
    },
    onError: (error: Error) => {
      toast.danger(error.message || "L’abonnement n’a pas pu être enregistré.");
    },
  });
