"use client";

import { useQuery } from "@tanstack/react-query";

import { horaireAPI } from "../apis/horaire.api";

import { horaireKeyQuery } from "./index.query";

export const useCreneauxQuery = () =>
  useQuery({
    queryKey: horaireKeyQuery("creneaux"),
    queryFn: async () => (await horaireAPI.creneaux()).data ?? [],
    staleTime: 30 * 1000,
  });

export const useExceptionsQuery = (from: string) =>
  useQuery({
    queryKey: horaireKeyQuery("exceptions", from),
    queryFn: async () => (await horaireAPI.exceptions(from)).data ?? [],
    staleTime: 30 * 1000,
  });
