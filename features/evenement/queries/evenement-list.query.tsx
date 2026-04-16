import { useQuery } from "@tanstack/react-query";
import { evenementAPI } from "../apis/evenement.api";
import { evenementKeyQuery } from "./index.query";

export const useEvenementListQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: evenementKeyQuery("list", params),
    queryFn: () => evenementAPI.obtenirTous(params),
    staleTime: 30 * 1000,
    placeholderData: (prev: any) => prev,
  });
