import { useQueryClient } from "@tanstack/react-query";

export const authentificationKeyQuery = (...params: unknown[]) => [
  "authentification",
  ...params,
];

export const useInvalidateAuthentificationQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: authentificationKeyQuery(...params),
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: authentificationKeyQuery(),
      type: "active",
    });
  };
};
