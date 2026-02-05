/**
 * Design Pattern: Dynamic Custom Hook with TanStack Query
 * 여러 stock symbol을 받아 병렬로 데이터를 조회합니다.
 */

import { useQueries } from "@tanstack/react-query";
import { getStockAsset } from "@/lib/api";

export function useStockAsset(symbols: string[]) {
  const results = useQueries({
    queries: symbols.map((symbol) => ({
      queryKey: ["eodhd-asset", symbol],
      queryFn: () => getStockAsset(symbol),
      enabled: !!symbol,
      staleTime: 30 * 1000,
      gcTime: 60 * 1000,
      retry: 2,
    })),
    combine: (results) => {
      return {
        stockData: results.map((result) => result.data),
        isPendingStock: results.some((result) => result.isPending),
        errorStock: results.find((result) => result.error)?.error,
      };
    },
  });

  return results;
}
