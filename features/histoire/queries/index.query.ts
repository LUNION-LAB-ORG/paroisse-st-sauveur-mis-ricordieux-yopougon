import { useQueryClient } from "@tanstack/react-query";

export const histoireKeyQuery = (...params: unknown[]) => [
  "histoire-admin",
  ...params,
];

export const useInvalidateHistoireQuery = () => {
  const queryClient = useQueryClient();

  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: histoireKeyQuery(...params),
    });
  };
};
