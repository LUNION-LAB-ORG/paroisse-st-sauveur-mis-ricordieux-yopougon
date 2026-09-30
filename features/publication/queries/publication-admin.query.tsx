"use client";

import type { ICommentaireAdmin } from "../apis/publication-admin.api";

import { useQuery } from "@tanstack/react-query";

import { publicationAdminAPI } from "../apis/publication-admin.api";

import { commentaireKeyQuery, publicationKeyQuery } from "./index.query";

export const usePublicationsAdminQuery = () =>
  useQuery({
    queryKey: publicationKeyQuery("liste"),
    queryFn: () => publicationAdminAPI.toutes(),
    staleTime: 30 * 1000,
  });

export const usePublicationAdminQuery = (id: number | null) =>
  useQuery({
    queryKey: publicationKeyQuery("fiche", id),
    queryFn: () => publicationAdminAPI.obtenir(id as number),
    enabled: !!id,
    staleTime: 30 * 1000,
  });

export const useCommentairesQuery = (status: ICommentaireAdmin["status"]) =>
  useQuery({
    queryKey: commentaireKeyQuery("liste", status),
    queryFn: () => publicationAdminAPI.commentaires(status, 100),
    staleTime: 20 * 1000,
  });

/** Nombre de commentaires d'un statut (onglets « En attente (4) »…). */
export const useNombreCommentairesQuery = (
  status: ICommentaireAdmin["status"],
) =>
  useQuery({
    queryKey: commentaireKeyQuery("nombre", status),
    queryFn: async () => {
      const r = await publicationAdminAPI.commentaires(status, 1);

      return r.meta?.total ?? r.data?.length ?? 0;
    },
    staleTime: 20 * 1000,
  });
