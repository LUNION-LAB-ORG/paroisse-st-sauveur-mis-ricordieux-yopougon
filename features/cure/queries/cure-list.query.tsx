import { useQuery } from "@tanstack/react-query";
import { cureAPI } from "../apis/cure.api";
import { cureKeyQuery } from "./index.query";

export const useCureListQuery = (params?: Record<string, unknown>) =>
  useQuery({
    queryKey: cureKeyQuery("list", params),
    queryFn: () => cureAPI.obtenirTous(params),
    staleTime: 30 * 1000,
    placeholderData: (prev: any) => prev,
  });
