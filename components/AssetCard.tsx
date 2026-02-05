/**
 * Design Pattern: Presentational Component (Pure UI)
 * props를 받아 렌더링만 담당하는 재사용 가능한 컴포넌트
 */

import type { AssetComparison } from "@/lib/types";
import Image from "next/image";
import { CopyButton } from "./CopyButton";

interface AssetCardProps {
  asset: AssetComparison;
  onClick?: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  const statusColors = {
    normal: "from-emerald-500/20 to-green-500/20 border-emerald-500/30",
    warning: "from-amber-500/20 to-orange-500/20 border-amber-500/30",
    critical: "from-red-500/20 to-pink-500/20 border-red-500/30",
  };

  const statusTextColors = {
    normal: "text-emerald-400",
    warning: "text-amber-400",
    critical: "text-red-400",
  };
  return (
    <div
      onClick={onClick}
      className={`
        glass glass-hover rounded-2xl p-6 cursor-pointer
        bg-gradient-to-br ${statusColors[asset.price.status]}
        animate-fade-in
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {asset.imageUrl && (
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              className="w-12 h-12 rounded-full"
              width={48}
              height={48}
            />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{asset.name}</h3>
              <CopyButton
                type="alert"
                token={asset.symbol}
                onChain={asset.price.onchain}
                market={asset.price.market}
              />
            </div>
            <p className="text-sm text-gray-400">{asset.symbol}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className={`
            px-3 py-1 rounded-full text-xs font-medium
            ${statusTextColors[asset.price.status]}
            bg-white/5
          `}
          >
            괴리율 {asset.price.gapPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">On-chain Price</span>
          <span className="text-lg font-mono text-white">
            ${asset.price.onchain.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Market Price</span>
          <span className="text-lg font-mono text-white">
            {asset.price.market
              ? `$${asset.price.market.toFixed(2)}`
              : "비상장"}
          </span>
        </div>

        <div className="pt-3 mt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Gap</span>
            <span
              className={`text-xl font-bold ${statusTextColors[asset.price.status]}`}
            >
              {asset.price.gapPercentage.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
