/**
 * API Service Layer
 * Helius API 호출 로직을 분리한 서비스 함수
 */

import type { HeliusAsset, EodhdAsset } from "./types";

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function getTokenAsset(id: string): Promise<HeliusAsset> {
  const response = await fetch(HELIUS_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-dashboard",
      method: "getAsset",
      params: { id },
    }),
  });

  // HTTP 에러 처리
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: HeliusAsset = await response.json();

  // API 응답 검증
  if (!data.result) {
    throw new Error("Invalid response: missing result");
  }

  return data;
}

const EODHD_API_KEY = process.env.NEXT_PUBLIC_EODHD_API_KEY;

export async function getStockAsset(symbol: string): Promise<EodhdAsset> {
  const response = await fetch(
    `https://eodhd.com/api/real-time/${symbol}.US?api_token=${EODHD_API_KEY}&fmt=json`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  // HTTP 에러 처리
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data: EodhdAsset = await response.json();

  // API 응답 검증
  if (!data) {
    throw new Error("Invalid response: missing result");
  }

  return data;
}
