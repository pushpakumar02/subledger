# SubLedger 💸

> **Recurring payments for everyone** — Stripe-like subscriptions powered by XRPL escrow and IPFS-verified receipts via Pinata. No bank required.

Built at **Midwest Blockathon 2025** 🏆

---

## 🎯 What It Does

SubLedger lets anyone — a creator, freelancer, or small business — set up recurring crypto payments (subscriptions) using the XRP Ledger, without needing a bank account.

**Example flow:**
1. A creator sets up a subscription with the payment details
2. SubLedger creates a time-locked **EscrowCreate** transaction on XRPL Testnet
3. A permanent, tamper-proof receipt is pinned to **IPFS via Pinata**
4. Anyone can verify the payment on the XRPL Explorer or via IPFS

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | **XRP Ledger (XRPL)** — EscrowCreate transactions on Testnet |
| Storage | **Pinata** — IPFS-pinned JSON receipts (CIDv1) |
| Frontend | **Next.js 14** + TypeScript |
| Styling | Vanilla CSS (glassmorphism dark theme) |

---

## ✨ Features

- 💵 **Stablecoin Support** — accept real RLUSD (Ripple's USD stablecoin) directly
- ⚡ **XRPL Escrow** — real on-chain EscrowCreate transactions (~3–5s settlement)
- 📌 **IPFS Receipts** — every payment generates an immutable Pinata-pinned receipt
- 🔍 **Wallet Manager** — fund test wallets from XRPL faucet, look up any address
- 🌍 **Borderless** — no bank account, no credit card, no middlemen
- 💸 **Near-zero fees** — ~$0.001 per transaction

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone & Install
```bash
git clone https://github.com/pushpakumar02/subledger.git
cd subledger
npm install
```

### 2. Set Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
PINATA_JWT=your_pinata_jwt_here       # https://app.pinata.cloud/developers/api-keys
```

> ⚠️ The Pinata API key is optional for basic testing — XRPL transactions work without it. The app gracefully degrades if the Pinata key is missing.

### 3. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📖 How to Use

### Get a Test Wallet
1. Click **Wallet** tab → **Fund New Wallet**
2. Receive 100 XRP from the XRPL Testnet faucet instantly
3. Copy your address and seed

### Create a Subscription
1. Click **Create** tab
2. Paste your seed and a recipient address
3. Set amount (XRP or RLUSD) and interval
4. Click **Create Subscription**
5. Get a real TX hash + IPFS receipt CID

### Verify
- Click the TX hash link → opens XRPL Explorer
- Click the IPFS link → opens Pinata gateway with full receipt

---

## 🏗 Architecture

```
User
        ↓
[Next.js API] → build EscrowCreate or Payment transaction
        ↓
[XRPL Testnet] → broadcast & confirm (~3-5s)
        ↓
[Pinata / IPFS] → pin JSON receipt → return CID
        ↓
User sees: TX hash + IPFS CID + Explorer links
```

---

## 🗂 Project Structure

```
src/
  app/
    page.tsx                        # Main UI (4 tabs: Home, Create, Wallet, How It Works)
    layout.tsx                      # Root layout + SEO metadata
    globals.css                     # Dark theme, glassmorphism styles
    api/
      create-subscription/route.ts  # XRPL EscrowCreate + Pinata pin
      send-rlusd/route.ts           # XRPL RLUSD Payment + TrustSet
      pin-receipt/route.ts          # Pinata IPFS upload
      fund-wallet/route.ts          # XRPL testnet faucet
      wallet-info/route.ts          # Address lookup + balance
```

---

## 🎯 Prize Tracks

This project was submitted to:
- 🏆 **XRPL Real-World Impact** (Ripple) — real EscrowCreate on XRPL Testnet
- 🏆 **Open Innovation General DApp** — meaningful on-chain state changes
- 🏆 **Pinata Builder Track** — Pinata as core architecture for receipt storage

---

## 🌍 Use Cases

- **Creators** — set up monthly newsletter / content subscriptions
- **Freelancers** — recurring retainer payments from clients
- **Microfinance** — subscription-based lending in emerging markets
- **SaaS** — decentralized subscription billing without Stripe

---

## 📝 License

MIT

---

*Built with ❤️ at Midwest Blockathon 2025 | XRPL + Pinata*
