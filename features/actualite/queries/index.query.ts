import { useQueryClient } from "@tanstack/react-query";

export const actualiteKeyQuery = (...params: unknown[]) => ["actualite", ...params];

export const useInvalidateActualiteQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({ queryKey: actualiteKeyQuery(...params), exact: false });
    await queryClient.refetchQueries({ queryKey: actualiteKeyQuery(), type: "active" });
  };
};
