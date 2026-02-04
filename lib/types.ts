/**
 * Design Pattern: Repository Pattern + Type-Safe API Models
 *
 * API 응답 타입과 도메인 모델을 분리하여 타입 안정성 확보
 */

// ============================================
// Helius API Types
// ============================================

export interface HeliusAsset {
  jsonrpc: string;
  result: {
    id: string;
    token_info: {
      symbol: string;
      price_info: {
        price_per_token: number;
        currency: string;
      };
    };
  };
  id: string;
}

// ============================================
// Eodhd API Types
// ============================================

export interface EodhdAsset {
  code: string;
  timestamp: number;
  gmtoffset: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  previousClose: number;
  change: number;
  change_p: number;
}

// ============================================
// Application Domain Types
// ============================================

export type DepegStatus = "normal" | "warning" | "critical";

export interface AssetPrice {
  onchain: number;
  market: number;
  gapPercentage: number;
  status: DepegStatus;
}

export interface AssetComparison {
  id: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  price: AssetPrice;
  lastUpdated: Date;
}

export interface DashboardStats {
  totalAssets: number;
  averageGap: number;
  criticalAssets: number;
  warningAssets: number;
}

// ============================================
// Utility Types
// ============================================

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}
