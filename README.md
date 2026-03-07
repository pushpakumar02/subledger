# FlowPay 💸

> **Recurring payments for everyone** — Stripe-like subscriptions powered by XRPL escrow, IPFS-verified receipts via Pinata, and natural-language setup with Gemini AI. No bank required.

Built at **Midwest Blockathon 2025** 🏆

---

## 🎯 What It Does

FlowPay lets anyone — a creator, freelancer, or small business — set up recurring crypto payments (subscriptions) using the XRP Ledger, without needing a bank account.

**Example flow:**
1. A creator describes their subscription in plain English → Gemini AI fills in the details
2. FlowPay creates a time-locked **EscrowCreate** transaction on XRPL Testnet
3. A permanent, tamper-proof receipt is pinned to **IPFS via Pinata**
4. Anyone can verify the payment on the XRPL Explorer or via IPFS

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Blockchain | **XRP Ledger (XRPL)** — EscrowCreate transactions on Testnet |
| Storage | **Pinata** — IPFS-pinned JSON receipts (CIDv1) |
| AI | **Google Gemini 1.5 Flash** — natural language → payment params |
| Frontend | **Next.js 14** + TypeScript |
| Styling | Vanilla CSS (glassmorphism dark theme) |
| IDE | Built with **Google Antigravity** |

---

## ✨ Features

- 🤖 **AI-Powered Setup** — describe your subscription in plain English, Gemini parses it
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
git clone https://github.com/pushpakumar02/flowpay.git
cd flowpay
npm install
```

### 2. Set Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
PINATA_JWT=your_pinata_jwt_here       # https://app.pinata.cloud/developers/api-keys
GEMINI_API_KEY=your_gemini_key_here   # https://aistudio.google.com/app/apikey
```

> ⚠️ Both keys are optional for basic testing — XRPL transactions work without them. The app gracefully degrades if keys are missing.

### 3. Run
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📖 How to Use

### Get a Test Wallet
1. Click **Wallet** tab → **Fund New Wallet**
2. Receive 1,000 XRP from the XRPL Testnet faucet instantly
3. Copy your address and seed

### Create a Subscription
1. Click **Create** tab
2. *(Optional)* Type a description in the AI box → click **Fill**
3. Paste your seed and a recipient address
4. Set amount (XRP) and interval
5. Click **Create Subscription**
6. Get a real TX hash + IPFS receipt CID

### Verify
- Click the TX hash link → opens XRPL Explorer
- Click the IPFS link → opens Pinata gateway with full receipt

---

## 🏗 Architecture

```
User (plain English)
        ↓
[Gemini AI] → parse intent → amount, interval, description
        ↓
[Next.js API] → build EscrowCreate transaction
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
      pin-receipt/route.ts          # Pinata IPFS upload
      ai-assist/route.ts            # Gemini AI parsing
      fund-wallet/route.ts          # XRPL testnet faucet
      wallet-info/route.ts          # Address lookup + balance
```

---

## 🎯 Prize Tracks

This project was submitted to:
- 🏆 **XRPL Real-World Impact** (Ripple) — real EscrowCreate on XRPL Testnet
- 🏆 **Open Innovation General DApp** — meaningful on-chain state changes
- 🏆 **Pinata Builder Track** — Pinata as core architecture for receipt storage
- 🏆 **MLH Best Use of Gemini API** — Gemini 1.5 Flash for NL parsing
- 🏆 **MLH Best Hack Built with Google Antigravity** — built using Antigravity

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

*Built with ❤️ at Midwest Blockathon 2025 | XRPL + Pinata + Gemini AI + Google Antigravity*
