"use client";

/**
 * Design Pattern: Client Component with Real-time Data
 * Helius + EODHD API를 활용한 실시간 가격 괴리 모니터링
 */

import { useTokenAsset } from "@/hooks/useTokenAsset";
import { useStockAsset } from "@/hooks/useStockAsset";
import { calculateGap, getDepegStatus } from "@/lib/utils";

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
        {/* Price Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* On-chain Price */}
          <div className="glass glass-hover rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">🔗 On-chain Price</p>
            <p className="text-4xl font-bold text-white mb-1">
              ${onchainPrice.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">from Solana (Helius)</p>
          </div>

          {/* Market Price */}
          <div className="glass glass-hover rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">📈 Market Price</p>
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

        {/* Detailed Comparison */}
        <section className="glass rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            📊 Price Analysis
          </h2>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>On-chain: ${onchainPrice.toFixed(2)}</span>
              <span>Market: ${marketPrice.toFixed(2)}</span>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  status === "critical"
                    ? "bg-gradient-to-r from-red-500 to-pink-500"
                    : status === "warning"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-green-500 to-emerald-500"
                }`}
                style={{ width: `${Math.min(gapPercentage * 10, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Gap: {gapPercentage.toFixed(4)}%
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Symbol</p>
              <p className="text-white font-semibold">
                {tokenData?.result.token_info.symbol || "N/A"}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Currency</p>
              <p className="text-white font-semibold">
                {stockData?.code || "USD"}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">24h Change</p>
              <p
                className={`font-semibold ${stockData?.change && stockData.change > 0 ? "text-green-400" : "text-red-400"}`}
              >
                {stockData?.change_p
                  ? `${stockData.change_p.toFixed(2)}%`
                  : "N/A"}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">Volume</p>
              <p className="text-white font-semibold">
                {stockData?.volume
                  ? (stockData.volume / 1000000).toFixed(1) + "M"
                  : "N/A"}
              </p>
            </div>
          </div>
        </section>

        {/* Tech Info */}
        <section className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">🛠️ Data Sources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-purple-400 font-semibold mb-1">
                Helius RPC (Solana)
              </p>
              <p className="text-gray-400">
                Token: {TOKEN_ADDRESS.NVDA.slice(0, 12)}...
              </p>
            </div>
            <div>
              <p className="text-purple-400 font-semibold mb-1">
                EODHD API (Real-time)
              </p>
              <p className="text-gray-400">
                Last Update:{" "}
                {new Date(stockData?.timestamp || 0 * 1000).toLocaleString()}
              </p>
            </div>
          </div>
        </section>
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
