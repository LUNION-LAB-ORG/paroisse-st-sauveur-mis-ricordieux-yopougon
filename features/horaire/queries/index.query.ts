import { useQueryClient } from "@tanstack/react-query";

export const horaireKeyQuery = (...params: unknown[]) => [
  "horaire-admin",
  ...params,
];

export const useInvalidateHoraireQuery = () => {
  const queryClient = useQueryClient();

  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: horaireKeyQuery(...params),
    });
  };
};
