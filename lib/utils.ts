import type { DepegStatus } from "./types";

// 데모 데이터 생성 유틸리티
export function calculateGap(onchain: number, market: number): number {
  return Math.abs((onchain - market) / market) * 100;
}

export function getDepegStatus(gapPercentage: number): DepegStatus {
  if (gapPercentage >= 5) return "critical";
  if (gapPercentage >= 2) return "warning";
  return "normal";
}
