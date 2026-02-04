/**
 * Design Pattern: Presentational Component
 * 가격 비교 시각화 컴포넌트
 */

import type { AssetPrice } from "@/lib/types";

interface PriceComparisonProps {
  price: AssetPrice;
  symbol: string;
}

export function PriceComparison({ price, symbol }: PriceComparisonProps) {
  const progressPercentage = Math.min(price.gapPercentage, 10) * 10;

  const barColors = {
    normal: "bg-gradient-to-r from-emerald-500 to-green-500",
    warning: "bg-gradient-to-r from-amber-500 to-orange-500",
    critical: "bg-gradient-to-r from-red-500 to-pink-500",
  };

  return (
    <div className="glass rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">
        Price Comparison: {symbol}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-400">On-chain</p>
          <p className="text-2xl font-bold text-white font-mono">
            ${price.onchain.toFixed(2)}
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-400">Market</p>
          <p className="text-2xl font-bold text-white font-mono">
            ${price.market.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Depeg Gap</span>
          <span className="text-white font-medium">
            {price.gapPercentage.toFixed(2)}%
          </span>
        </div>

        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColors[price.status]} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>5%</span>
          <span>10%+</span>
        </div>
      </div>
    </div>
  );
}
