import { useQueryClient } from "@tanstack/react-query";

export const evenementKeyQuery = (...params: unknown[]) => ["evenement", ...params];

export const useInvalidateEvenementQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({ queryKey: evenementKeyQuery(...params), exact: false });
    await queryClient.refetchQueries({ queryKey: evenementKeyQuery(), type: "active" });
  };
};
