import { useQuery } from "@tanstack/react-query";
import { actualiteAPI } from "../apis/actualite.api";
import { actualiteKeyQuery } from "./index.query";

export const useActualiteListQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: actualiteKeyQuery("list", params),
    queryFn: () => actualiteAPI.obtenirTous(params),
    staleTime: 30 * 1000,
    placeholderData: (prev: any) => prev,
  });
