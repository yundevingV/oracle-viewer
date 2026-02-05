/**
 * Design Pattern: Dynamic Custom Hook with TanStack Query
 * 여러 토큰 주소를 받아 병렬로 데이터를 조회합니다.
 */

import { useQueries } from "@tanstack/react-query";
import { getTokenAsset } from "@/lib/api";

export function useTokenAsset(token_addresses: string[]) {
  const results = useQueries({
    queries: token_addresses.map((address) => ({
      queryKey: ["helius-asset", address],
      queryFn: () => getTokenAsset(address),
      enabled: !!address,
      staleTime: 30 * 1000,
      gcTime: 60 * 1000,
      retry: 2,
    })),
    combine: (results) => {
      return {
        tokenData: results.map((result) => result.data),
        isPendingToken: results.some((result) => result.isPending),
        errorToken: results.find((result) => result.error)?.error,
      };
    },
  });

  return results;
}
