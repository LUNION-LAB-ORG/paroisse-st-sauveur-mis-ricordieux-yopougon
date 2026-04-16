import { useQuery } from "@tanstack/react-query";
import { messeAPI } from "../apis/messe.api";
import { messeKeyQuery } from "./index.query";

export const useMesseListQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: messeKeyQuery("list", params),
    queryFn: () => messeAPI.obtenirTous(params),
    staleTime: 30 * 1000,
    placeholderData: (prev: any) => prev,
  });
