import { useQueryClient } from "@tanstack/react-query";

export const liturgieKeyQuery = (...params: unknown[]) => [
  "liturgie-admin",
  ...params,
];

export const useInvalidateLiturgieQuery = () => {
  const queryClient = useQueryClient();

  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: liturgieKeyQuery(...params),
    });
    await queryClient.invalidateQueries({
      queryKey: ["admin", "tableau-de-bord"],
    });
  };
};
