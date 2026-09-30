import { useQueryClient } from "@tanstack/react-query";

export const annonceKeyQuery = (...params: unknown[]) => [
  "annonce-admin",
  ...params,
];

export const useInvalidateAnnonceQuery = () => {
  const queryClient = useQueryClient();

  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: annonceKeyQuery(...params),
    });
  };
};
