import { useQueryClient } from "@tanstack/react-query";

export const publicationKeyQuery = (...params: unknown[]) => [
  "publication-admin",
  ...params,
];

export const commentaireKeyQuery = (...params: unknown[]) => [
  "commentaire-admin",
  ...params,
];

export const useInvalidatePublicationQuery = () => {
  const queryClient = useQueryClient();

  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: publicationKeyQuery(...params),
    });
  };
};

/** Après modération : listes de commentaires + compteur du menu latéral. */
export const useInvalidateCommentaireQuery = () => {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({ queryKey: commentaireKeyQuery() });
    await queryClient.invalidateQueries({
      queryKey: ["admin", "tableau-de-bord"],
    });
  };
};
