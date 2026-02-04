/**
 * Design Pattern: Container Component
 * 데이터 관리 및 렌더링 로직 포함
 */

"use client";

import { useState } from "react";
import { AssetCard } from "./AssetCard";
import type { AssetComparison } from "@/lib/types";

interface AssetListProps {
  assets: AssetComparison[];
}

export function AssetList({ assets }: AssetListProps) {
  const [sortBy, setSortBy] = useState<"gap" | "name">("gap");

  const sortedAssets = [...assets].sort((a, b) => {
    if (sortBy === "gap") {
      return b.price.gapPercentage - a.price.gapPercentage;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">
          Assets ({assets.length})
        </h2>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "gap" | "name")}
          className="glass px-4 py-2 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="gap">Sort by Gap</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAssets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {assets.length === 0 && (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-gray-400">No assets found</p>
        </div>
      )}
    </div>
  );
}
