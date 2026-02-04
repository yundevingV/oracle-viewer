/**
 * Design Pattern: Custom Hook with TanStack Query
 * Helius API에서 토큰 정보를 조회하는 React Query Hook
 */

import { useQuery } from "@tanstack/react-query";
import { getStockAsset } from "@/lib/api";

export function useStockAsset(symbol: string) {
  const { data, isPending, error } = useQuery({
    queryKey: ["eodhd-asset", symbol],
    queryFn: () => getStockAsset(symbol),
    enabled: !!symbol,
    staleTime: 30 * 1000, // 30초간 캐시 유지
    gcTime: 60 * 1000, // 60초 후 가비지 컬렉션
    retry: 2, // 실패 시 2번 재시도
  });

  return {
    stockData: data,
    isPendingStock: isPending,
    errorStock: error,
  };
}
