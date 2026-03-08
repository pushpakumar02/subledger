"use client";

import { Icons } from "@/components/Shared";
import Link from "next/link";

export default function GettingStarted() {
    const steps = [
        {
            step: "01",
            title: "Wallet Manager",
            desc: "Visit the 'Wallet' tab to manage your test accounts. You can 'Fund' a new wallet to instantly get 100 test XRP, or use the 'Lookup' tool to check the live balance and transaction status of any XRPL address.",
            icon: <Icons.Wallet />,
            color: "#4f7cff"
        },
        {
            step: "02",
            title: "Create a Subscription",
            desc: "Go to 'Create' and choose your method. 'XRP Smart Escrow' time-locks native funds, while 'RLUSD' sends Ripple's stablecoin. Use the 'Demo Address' button for a one-click setup during your first test.",
            icon: <Icons.Zap />,
            color: "#10b981"
        },
        {
            step: "03",
            title: "Verify On-Chain",
            desc: "Once submitted, you'll get a 'TX Hash' and an 'IPFS CID'. Click the link icons next to them to instantly verify the payment on the XRPL Explorer or view your immutable receipt stored on the IPFS network.",
            icon: <Icons.Check />,
            color: "#7c3aed"
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
                        SubLedger is a decentralized subscription layer. Here is how to manage your wallet, create subscriptions, and verify data on-chain.
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
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#4f7cff" }}>What is the Wallet Page for?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                The **Wallet** page is your command center. Use it to generate test credentials, get free XRP from the faucet, or look up *any* recipient address to make sure they are active on the network before sending funds.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#10b981" }}>How do I verify a payment?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Every success screen provides a **TX Hash** (for the blockchain) and a **CID** (for the receipt). Verification is trustless—you don't need SubLedger to see it; you can use any XRPL Explorer or IPFS Gateway.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#7c3aed" }}>Wait, what is an Escrow?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                An Escrow is a "Smart Vault" on the blockchain. Once you lock XRP in it, the funds are held securely until the time expires. It guarantees the merchant gets paid without them needing to control your wallet.
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

