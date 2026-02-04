# 🛡️ Oracle-Viewer

**Real-time Solana Synthetic Asset Depegging Monitor**

솔라나 기반 합성 자산과 실제 자산(나스닥 주식) 사이의 가격 괴리를 실시간으로 감시하고 시각화하는 대시보드입니다.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Data Source**:
  - **On-chain**: Helius RPC (DAS API / `getAsset`)
  - **Off-chain**: Massive (Polygon) API (`prev` Aggregates)
- **Monitoring**: Custom Depegging Logic ($Gap > 2\%$)

## 📊 Core Logic

실제 시장 가격과 온체인 가격을 비교하여 괴리율을 계산합니다.

```math
Gap(\%) = \frac{|P_{real} - P_{onchain}|}{P_{real}} \times 100
```

여기서:

- $P_{real}$: 실제 시장 가격 (나스닥)
- $P_{onchain}$: 온체인 합성 자산 가격

## 🚀 Getting Started

### 1. Environment Variables (`.env.local`)

```env
NEXT_PUBLIC_HELIUS_API_KEY=your_helius_key
NEXT_PUBLIC_MASSIVE_API_KEY=your_massive_key
NEXT_PUBLIC_WALLET_ADDRESS=your_solana_wallet_address
```
