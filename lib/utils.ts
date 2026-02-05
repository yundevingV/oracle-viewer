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

/**
 * 클립보드에 텍스트를 복사하는 유틸리티 함수
 * @param text - 복사할 텍스트
 * @returns 성공 여부를 나타내는 Promise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // 최신 Clipboard API 사용
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback: execCommand 사용 (deprecated)
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const result = document.execCommand("copy");
    textArea.remove();
    return result;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
}
