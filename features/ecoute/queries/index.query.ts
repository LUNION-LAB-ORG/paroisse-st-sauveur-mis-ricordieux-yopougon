import { useQueryClient } from "@tanstack/react-query";

export const ecouteKeyQuery = (...params: unknown[]) => ["ecoute", ...params];

export const useInvalidateEcouteQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({ queryKey: ecouteKeyQuery(...params), exact: false });
    await queryClient.refetchQueries({ queryKey: ecouteKeyQuery(), type: "active" });
  };
};
