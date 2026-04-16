"use client";

import { useQuery } from "@tanstack/react-query";
import { participantAPI } from "../apis/participant.api";
import { participantKeyQuery } from "./index.query";
import type { IParticipantListeReponse } from "../types/participant.type";

export const useParticipantListQuery = (
  params?: Record<string, string>,
) => {
  return useQuery<IParticipantListeReponse>({
    queryKey: participantKeyQuery("list", params),
    queryFn: () => participantAPI.obtenirTous(params),
  });
};

export const useParticipantParEvenementQuery = (eventId: number) => {
  return useQuery<IParticipantListeReponse>({
    queryKey: participantKeyQuery("event", eventId),
    queryFn: () => participantAPI.obtenirParEvenement(eventId),
    enabled: !!eventId,
  });
};
