/**
 * Design Pattern: API Route Handler (Next.js App Router)
 * Edge Runtime으로 실행되는 서버리스 함수
 */

import { NextRequest, NextResponse } from "next/server";
import type {
  HeliusGetAssetResponse,
  ApiResponse,
  HeliusAsset,
} from "@/lib/types";

export const runtime = "edge";

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;
const HELIUS_RPC_URL = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          error: {
            error: "Bad Request",
            message: "Asset id is required",
            statusCode: 400,
          },
        },
        { status: 400 },
      );
    }

    const response = await fetch(HELIUS_RPC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "my-dashboard",
        method: "getAsset",
        params: { id },
      }),
    });

    if (!response.ok) {
      throw new Error(`Helius API error: ${response.statusText}`);
    }

    const data: HeliusGetAssetResponse = await response.json();

    return NextResponse.json<ApiResponse<HeliusAsset>>({
      success: true,
      data: data.result,
    });
  } catch (error) {
    console.error("[API Error] get-asset:", error);

    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        error: {
          error: "Internal Server Error",
          message: error instanceof Error ? error.message : "Unknown error",
          statusCode: 500,
        },
      },
      { status: 500 },
    );
  }
}
