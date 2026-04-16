import { useQueryClient } from "@tanstack/react-query";

export const organisationKeyQuery = (...params: unknown[]) => [
  "organisation",
  ...params,
];

export const useInvalidateOrganisationQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: organisationKeyQuery(...params),
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: organisationKeyQuery(),
      type: "active",
    });
  };
};
