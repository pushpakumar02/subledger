"use client";

import { Icons, FeatureCard, StatCard } from "@/components/Shared";
import Link from "next/link";

export default function Home() {
  return (
    <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
      <div className="slide-up" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        {/* Badge */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{
            background: "rgba(79,124,255,0.1)", border: "1px solid rgba(79,124,255,0.2)",
            borderRadius: "20px", padding: "6px 16px", fontSize: "12px",
            display: "flex", alignItems: "center", gap: "8px", fontWeight: 600,
          }}>
            <Icons.Star /> Built at Midwest Blockathon 2025 · XRPL + Pinata
          </div>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: "4.5rem", fontWeight: 900, textAlign: "center",
          lineHeight: 1.1, marginBottom: "24px", letterSpacing: "-1px",
        }}>
          Recurring Payments<br />
          <span className="gradient-text">for Everyone.</span>
        </h1>

        <p style={{
          textAlign: "center", color: "var(--text-secondary)",
          fontSize: "18px", maxWidth: "600px", margin: "0 auto 48px",
          lineHeight: 1.6,
        }}>
          Stripe-like subscriptions powered by <strong>XRPL escrow</strong>, and IPFS-verified receipts via <strong>Pinata</strong>. No bank required.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "64px" }}>
          <Link href="/create" className="btn-primary"
            style={{
              padding: "16px 32px", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px",
              textDecoration: "none",
            }}>
            Create Subscription <Icons.ArrowRight />
          </Link>
          <Link href="/wallet" style={{
            padding: "16px 32px", fontSize: "16px",
            background: "transparent", border: "1px solid rgba(79,124,255,0.3)",
            borderRadius: "12px", color: "var(--text-primary)", cursor: "pointer",
            fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
            transition: "all 0.2s", textDecoration: "none",
          }}>
            <Icons.Wallet /> Get Test Wallet
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "16px", marginBottom: "48px" }}>
          <StatCard label="Settlement Time" value="3–5s" sub="XRPL Testnet" />
          <StatCard label="Transaction Fee" value="~$0.001" sub="Near-zero cost" />
          <StatCard label="Receipt Storage" value="IPFS" sub="via Pinata" />
          <StatCard label="Stablecoins" value="RLUSD" sub="Ripple USD" />
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))", gap: "16px", marginBottom: "48px" }}>
          <FeatureCard
            icon={<Icons.Zap />}
            title="XRPL Escrow Payments"
            desc="Time-locked escrow transactions on XRP Ledger Testnet. Funds release automatically when the subscription period ends."
            color="#4f7cff"
          />
          <FeatureCard
            icon={<Icons.Shield />}
            title="IPFS-Verified Receipts"
            desc="Every payment creates an immutable receipt stored on IPFS via Pinata. Proof of payment that can never be altered."
            color="#7c3aed"
          />
          <FeatureCard
            icon={<Icons.Wallet />}
            title="Stablecoin Support"
            desc="Accept real RLUSD (Ripple's USD stablecoin) directly. No more price volatility, perfectly suited for monthly subscriptions."
            color="#06b6d4"
          />
          <FeatureCard
            icon={<Icons.Globe />}
            title="Borderless & Inclusive"
            desc="No bank account, no credit card, no middlemen. Anyone with an XRPL wallet can send or receive recurring payments."
            color="#10b981"
          />
        </div>
      </div>
    </main>
  );
}
