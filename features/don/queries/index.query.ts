import { useQueryClient } from "@tanstack/react-query";

export const donKeyQuery = (...params: unknown[]) => [
  "don",
  ...params,
];

export const useInvalidateDonQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: donKeyQuery(...params),
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: donKeyQuery(),
      type: "active",
    });
  };
};
