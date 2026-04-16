import { useQuery } from "@tanstack/react-query";
import { ecouteAPI } from "../apis/ecoute.api";
import { ecouteKeyQuery } from "./index.query";

export const useEcouteListQuery = (params?: Record<string, string>) =>
  useQuery({
    queryKey: ecouteKeyQuery("list", params),
    queryFn: () => ecouteAPI.obtenirTous(params),
    staleTime: 30 * 1000,
    placeholderData: (prev: any) => prev,
  });
