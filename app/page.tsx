"use client";

/**
 * Design Pattern: Client Component with Real-time Data
 * Helius + EODHD API를 활용한 실시간 가격 괴리 모니터링
 */

import { useTokenAsset } from "@/hooks/useTokenAsset";
import { useStockAsset } from "@/hooks/useStockAsset";
import { calculateGap, getDepegStatus } from "@/lib/utils";
import { CopyButton } from "@/components/CopyButton";

const TOKEN_ADDRESS = {
  NVDA: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
};

export default function Home() {
  const { tokenData, isPendingToken, errorToken } = useTokenAsset(
    TOKEN_ADDRESS.NVDA,
  );
  const { stockData, isPendingStock, errorStock } = useStockAsset("NVDA");

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

  // 데이터 추출
  const onchainPrice =
    tokenData?.result.token_info.price_info.price_per_token || 0;
  const marketPrice = stockData?.close || 0;
  const gapPercentage = calculateGap(onchainPrice, marketPrice);
  const status = getDepegStatus(gapPercentage);

  // 상태별 색상
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
          className={`absolute inset-0 bg-gradient-to-r ${statusBg[status]} blur-3xl`}
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
              className={`inline-block px-4 py-2 glass rounded-full ${statusColors[status]} font-semibold`}
            >
              Status: {status.toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        {/* Asset Title Card */}
        <section className=" rounded-2xl p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl font-bold">엔비디아 (NVDA)</h2>
            </div>
            <CopyButton
              type="alert"
              token="엔비디아"
              onChain={onchainPrice.toFixed(2)}
              market={marketPrice.toFixed(2)}
              label="정보 가져오기"
            />
          </div>
        </section>

        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* On-chain Price */}
          <div className="glass glass-hover rounded-2xl p-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-gray-400">🔗 On-chain Price</p>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              ${onchainPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">from Solana (Helius)</p>
          </div>

          {/* Market Price */}
          <div className="glass glass-hover rounded-2xl p-6">
            <div className="flex items-start justify-between mb-2">
              <p className="text-sm text-gray-400">📈 Market Price</p>
            </div>
            <p className="text-4xl font-bold text-white mb-1">
              ${marketPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">NVDA (EODHD Real-time)</p>
          </div>

          {/* Gap */}
          <div
            className={`glass glass-hover rounded-2xl p-6 border ${
              status === "critical"
                ? "border-red-500/50"
                : status === "warning"
                  ? "border-amber-500/50"
                  : "border-green-500/50"
            }`}
          >
            <p className="text-sm text-gray-400 mb-2">⚠️ Price Gap</p>
            <p className={`text-4xl font-bold mb-1 ${statusColors[status]}`}>
              {gapPercentage.toFixed(2)}%
            </p>
            <p className="text-xs text-gray-500">
              {status === "critical"
                ? "CRITICAL - Action Required"
                : status === "warning"
                  ? "WARNING - Monitor Closely"
                  : "NORMAL - All Good"}
            </p>
          </div>
        </div>
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
