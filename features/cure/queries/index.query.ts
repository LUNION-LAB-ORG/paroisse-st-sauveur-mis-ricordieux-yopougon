import { useQueryClient } from "@tanstack/react-query";

export const cureKeyQuery = (...params: unknown[]) => ["cure", ...params];

export const useInvalidateCureQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({ queryKey: cureKeyQuery(...params), exact: false });
    await queryClient.refetchQueries({ queryKey: cureKeyQuery(), type: "active" });
  };
};
