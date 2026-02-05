import { useState, useCallback } from "react";
import { copyToClipboard } from "@/lib/utils";

/**
 * 클립보드 복사 기능을 제공하는 커스텀 훅
 * @returns copy 함수, 복사 상태, 리셋 함수
 */
export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    setIsCopied(success);

    if (success) {
      // 2초 후 자동으로 상태 리셋
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }

    return success;
  }, []);

  const reset = useCallback(() => {
    setIsCopied(false);
  }, []);

  return { copy, isCopied, reset };
}
