// hooks/useTokenAsset.ts
import { useQuery } from "@tanstack/react-query";
import type { HeliusAsset, ApiResponse } from "@/lib/types";

export function useTokenAsset(assetId: string) {
  return useQuery({
    queryKey: ["helius-asset", assetId],
    queryFn: async () => {
      // ✅ Next.js API Route를 통해 호출 (서버 사이드)
      const response = await fetch("/api/helius/get-asset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: assetId }),
      });

      const data: ApiResponse<HeliusAsset> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error?.message || "Failed to fetch asset");
      }

      return data.data;
    },
    enabled: !!assetId,
  });
}
