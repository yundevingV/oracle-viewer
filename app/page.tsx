"use client";

/**
 * Design Pattern: Client Component with Real-time Data
 * Helius + EODHD API를 활용한 실시간 가격 괴리 모니터링
 */

import { useTokenAsset } from "@/hooks/useTokenAsset";
import { useStockAsset } from "@/hooks/useStockAsset";
import { calculateGap, getDepegStatus } from "@/lib/utils";
import { AssetCard } from "@/components/AssetCard";
import type { AssetComparison } from "@/lib/types";

const ASSETS = [
  {
    name: "엔비디아",
    symbol: "NVDA",
    tokenAddress: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
    stockSymbol: "NVDA",
  },
  {
    name: "테슬라",
    symbol: "TSLA",
    tokenAddress: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    stockSymbol: "TSLA",
  },
  {
    name: "스페이스X",
    symbol: "SPACEX",
    tokenAddress: "PreANxuXjsy2pvisWWMNB6YaJNzr7681wJJr2rHsfTh",
    stockSymbol: "SPACEX",
  },
];

export default function Home() {
  const { tokenData, isPendingToken, errorToken } = useTokenAsset(
    ASSETS.map((a) => a.tokenAddress),
  );

  const { stockData, isPendingStock, errorStock } = useStockAsset(
    ASSETS.map((a) => a.stockSymbol),
  );

  // 로딩 상태
  if (isPendingToken || isPendingStock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="glass rounded-xl p-8 flex items-center gap-4">
          <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading real-time data...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (errorToken || errorStock) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="glass rounded-xl p-8 border border-red-500/50">
          <p className="text-red-400 text-lg">
            ⚠️ Error: {errorToken?.message || errorStock?.message}
          </p>
        </div>
      </div>
    );
  }

  // AssetComparison 배열 생성
  const assetComparisons: AssetComparison[] = ASSETS.map((asset, index) => {
    const token = tokenData[index];
    const stock = stockData[index];

    const isPreStock = stock?.close === "NA";

    const onchainPrice =
      token?.result.token_info.price_info.price_per_token || 0;
    const marketPrice = isPreStock ? 0 : Number(stock?.close);
    const gapPercentage = isPreStock
      ? 0
      : calculateGap(onchainPrice, marketPrice);
    const status = getDepegStatus(gapPercentage);

    return {
      id: asset.symbol,
      name: asset.name,
      symbol: asset.symbol,
      price: {
        onchain: onchainPrice,
        market: marketPrice,
        gapPercentage,
        status,
      },
      imageUrl: undefined,
      lastUpdated: new Date(),
      tokenAddress: asset.tokenAddress,
    };
  });

  // 전체 상태 계산 (가장 심각한 상태 사용)
  const overallStatus = assetComparisons.some(
    (a) => a.price.status === "critical",
  )
    ? "critical"
    : assetComparisons.some((a) => a.price.status === "warning")
      ? "warning"
      : "normal";

  const statusColors = {
    normal: "text-green-400",
    warning: "text-amber-400",
    critical: "text-red-400",
  };

  const statusBg = {
    normal: "from-green-500/20 to-emerald-500/20",
    warning: "from-amber-500/20 to-orange-500/20",
    critical: "from-red-500/20 to-pink-500/20",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div
          className={`absolute inset-0 bg-gradient-to-r ${statusBg[overallStatus]} blur-3xl`}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold gradient-text animate-fade-in">
              🛡️ Oracle Viewer
            </h1>
            <p className="text-xl text-gray-300">
              Real-time Solana Synthetic Asset Depegging Monitor
            </p>
            <div
              className={`inline-block px-4 py-2 glass rounded-full ${statusColors[overallStatus]} font-semibold`}
            >
              Status: {overallStatus.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-6">
        {/* Asset Cards List */}
        {assetComparisons.map((asset) => (
          <AssetCard key={asset.symbol} asset={asset} />
        ))}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400 text-sm">
          <p>Built with Next.js • Helius RPC • EODHD API • TanStack Query</p>
        </div>
      </footer>
    </div>
  );
}
