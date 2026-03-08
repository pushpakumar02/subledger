"use client";

import { Icons } from "@/components/Shared";
import Link from "next/link";

export default function GettingStarted() {
    const steps = [
        {
            step: "01",
            title: "Prepare Your Wallet",
            desc: "Start by visiting the 'Wallet' tab. You can instantly generate a fresh XRPL Testnet address with 100 test XRP. Copy your Address and Secret Seed—you'll need them to sign your first transaction.",
            icon: <Icons.Wallet />,
            color: "#4f7cff"
        },
        {
            step: "02",
            title: "Choose Your Payment Method",
            desc: "Head to the 'Create' section. You have two options: use 'XRP Smart Escrow' to time-lock your native funds until a specific date, or use 'RLUSD' for a stable-value recurring payment experience.",
            icon: <Icons.Zap />,
            color: "#10b981"
        },
        {
            step: "03",
            title: "Submit & Secure",
            desc: "Paste your recipient's address (or use our Demo Address), set your amount, and hit confirm. SubLedger will sign the transaction on-chain and instantly pin a cryptographic receipt to IPFS for permanent proof.",
            icon: <Icons.Check />,
            color: "#7c3aed"
        },
        {
            step: "04",
            title: "Immutable Verification",
            desc: "After any transaction, you'll receive a unique TX Hash and an IPFS CID. You can use these to verify your payment live on the XRPL Explorer or retrieve your receipt from the global IPFS gateway.",
            icon: <Icons.Link />,
            color: "#06b6d4"
        }
    ];

    return (
        <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
            <div className="slide-up" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
                <div style={{ textAlign: "center", marginBottom: "50px" }}>
                    <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "12px" }}>
                        Getting <span className="gradient-text">Started</span>
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
                        SubLedger is a decentralized subscription layer. Here is how you can go from zero to a live on-chain subscription in under 60 seconds.
                    </p>
                </div>

                <div style={{ display: "grid", gap: "24px" }}>
                    {steps.map((s, i) => (
                        <div key={i} className="glass-card" style={{
                            padding: "32px",
                            display: "flex",
                            gap: "24px",
                            alignItems: "center",
                            border: `1px solid ${s.color}15`
                        }}>
                            <div style={{
                                width: "64px", height: "64px", borderRadius: "16px",
                                background: `${s.color}15`, color: s.color,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "24px", flexShrink: 0
                            }}>
                                {s.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                    <span style={{ fontSize: "12px", fontWeight: 800, color: s.color, opacity: 0.8 }}>STEP {s.step}</span>
                                    <h3 style={{ fontSize: "18px", fontWeight: 700 }}>{s.title}</h3>
                                </div>
                                <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "14px" }}>
                                    {s.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FAQ/Quick Tips */}
                <div style={{ marginTop: "60px" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "24px", textAlign: "center" }}>Quick Essentials</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#4f7cff" }}>Wait, what is an Escrow?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                An Escrow is a "Smart Contract" that holds funds in a vault. The funds cannot be touched by the sender OR the receiver until the time lock expires. It's the ultimate way to prove you have funds for a subscription.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#10b981" }}>Why do I need a receipt?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Banks give you paper receipts; SubLedger gives you IPFS receipts. These are cryptographically signed JSON files that prove the transaction happened, stored forever on a decentralized file system.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#06b6d4" }}>The Wallet Manager</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                The **Wallet** page is your command center. Use it to generate test accounts, claim free XRP from the faucet, and look up ANY XRPL address to check their real-time balance before sending a payment.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#7c3aed" }}>Is this on Mainnet?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Not yet. We are currently running on the **XRPL Testnet**. This means all funds are "test XRP" and have no real-world value. Perfect for building and testing your implementation!
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: "64px", textAlign: "center" }}>
                    <Link href="/create" className="btn-primary" style={{ textDecoration: "none", padding: "16px 32px", fontSize: "16px" }}>
                        Ready to Start? Create a Subscription →
                    </Link>
                </div>
            </div>
        </main>
    );
}

