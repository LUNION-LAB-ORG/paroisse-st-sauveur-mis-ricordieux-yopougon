import { useQueryClient } from "@tanstack/react-query";

export const messeKeyQuery = (...params: unknown[]) => ["messe", ...params];

export const useInvalidateMesseQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({ queryKey: messeKeyQuery(...params), exact: false });
    await queryClient.refetchQueries({ queryKey: messeKeyQuery(), type: "active" });
  };
};
