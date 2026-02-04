/**
 * Design Pattern: Repository Pattern + Type-Safe API Models
 *
 * API 응답 타입과 도메인 모델을 분리하여 타입 안정성 확보
 */

// ============================================
// Helius API Types
// ============================================

export interface HeliusAssetOwnership {
  ownerAddress: string;
  displayOptions: {
    showRawData: boolean;
    showNativeBalance: boolean;
  };
}

export interface HeliusAsset {
  id: string;
  content?: {
    metadata?: {
      name?: string;
      symbol?: string;
      description?: string;
    };
    links?: {
      image?: string;
    };
  };
  ownership?: {
    owner?: string;
  };
  compression?: {
    compressed: boolean;
  };
}

export interface HeliusGetAssetsByOwnerRequest {
  ownerAddress: string;
  displayOptions?: {
    showRawData?: boolean;
    showNativeBalance?: boolean;
  };
}

export interface HeliusGetAssetsByOwnerResponse {
  jsonrpc: string;
  result: {
    total: number;
    limit: number;
    page: number;
    items: HeliusAsset[];
  };
}

export interface HeliusGetAssetRequest {
  id: string;
}

export interface HeliusGetAssetResponse {
  jsonrpc: string;
  result: HeliusAsset;
}

// ============================================
// Polygon API Types
// ============================================

export interface PolygonTickerParams {
  symbol: string;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface PolygonAggregate {
  c: number; // close
  h: number; // high
  l: number; // low
  o: number; // open
  v: number; // volume
  t: number; // timestamp
}

export interface PolygonTickerResponse {
  ticker: string;
  queryCount: number;
  resultsCount: number;
  adjusted: boolean;
  results: PolygonAggregate[];
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
