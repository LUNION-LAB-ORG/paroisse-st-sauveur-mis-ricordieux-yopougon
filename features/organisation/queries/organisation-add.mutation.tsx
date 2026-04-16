"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { organisationAPI } from "../apis/organisation.api";
import { useInvalidateOrganisationQuery } from "./index.query";
import type { IOrganisationCreer } from "../types/organisation.type";

export const useOrganisationAddMutation = () => {
  const invalidate = useInvalidateOrganisationQuery();

  return useMutation({
    mutationFn: (data: IOrganisationCreer) => organisationAPI.ajouter(data),
    onSuccess: async () => {
      toast.success("Demande d'organisation soumise avec succes");
      await invalidate();
    },
    onError: () => {
      toast.error("Erreur lors de la soumission de la demande");
    },
  });
};
