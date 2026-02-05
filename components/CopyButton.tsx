"use client";

import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

type CopyButtonType = "information" | "alert";

interface CopyButtonProps {
  type: CopyButtonType;
  token: string;
  onChain: number;
  market: number;
  label?: string;
  className?: string;
}

/**
 * 클립보드 복사 버튼 컴포넌트
 * 복사 성공 시 체크마크 아이콘으로 변경되며 2초 후 자동 리셋
 */
export function CopyButton({
  type,
  token,
  onChain,
  market,
  label,
  className = "",
}: CopyButtonProps) {
  const { copy, isCopied } = useCopyToClipboard();

  const handleCopy = async () => {
    let text = "";
    if (type === "alert") {
      // 괴리율 계산
      const onChainValue = onChain;
      const marketValue = market;
      const gap = Math.abs(
        ((onChainValue - marketValue) / marketValue) * 100,
      ).toFixed(2);
      const isPreStock = marketValue === 0;
      text = `[속보]

${token} 괴리율 ${gap}%
🔗 On-chain Price
$${onChain}
from Solana 

📈 Market Price
${isPreStock ? "비상장" : `$${market}`}`;
    } else {
      text = `On-chain: $${onChain} | Market: $${market}`;
    }

    await copy(text);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 px-3 py-1.5 glass glass-hover rounded-lg text-sm font-medium transition-all duration-200 ${
        isCopied ? "text-green-400" : "text-gray-300"
      } ${className}`}
      title={isCopied ? "Copied!" : "Copy to clipboard"}
    >
      {isCopied ? (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Copied!</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          {label && <span>{label}</span>}
        </>
      )}
    </button>
  );
}
