import { useQueryClient } from "@tanstack/react-query";

export const mediationKeyQuery = (...params: unknown[]) => [
  "mediation",
  ...params,
];

export const useInvalidateMediationQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: mediationKeyQuery(...params),
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: mediationKeyQuery(),
      type: "active",
    });
  };
};
