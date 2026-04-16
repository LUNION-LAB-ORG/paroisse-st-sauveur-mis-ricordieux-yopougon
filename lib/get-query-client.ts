import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 5 * 60 * 1000,
          retry: (failureCount, error: any) => {
            if (error?.status === 404) return false;
            return failureCount < 3;
          },
        },
      },
    })
);

export default getQueryClient;
