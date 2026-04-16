import { useQueryClient } from "@tanstack/react-query";

export const participantKeyQuery = (...params: unknown[]) => [
  "participant",
  ...params,
];

export const useInvalidateParticipantQuery = () => {
  const queryClient = useQueryClient();
  return async (...params: unknown[]) => {
    await queryClient.invalidateQueries({
      queryKey: participantKeyQuery(...params),
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: participantKeyQuery(),
      type: "active",
    });
  };
};
