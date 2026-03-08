"use client";

import { Icons } from "@/components/Shared";
import Link from "next/link";

export default function GettingStarted() {
    const steps = [
        {
            step: "01",
            title: "Prepare Your Wallet",
            desc: "Start by visiting the 'Wallet' tab. You can instantly generate a fresh XRPL Testnet address with 100 test XRP. Copy your Address and Secret Seed—you'll need them to sign your first transaction.",
            color: "#4f7cff",
            tag: "Testnet Faucet"
        },
        {
            step: "02",
            title: "Choose Your Payment Method",
            desc: "Head to the 'Create' section. You have two options: use 'XRP Smart Escrow' to time-lock your native funds until a specific date, or use 'RLUSD' for a stable-value recurring payment experience.",
            color: "#7c3aed",
            tag: "Native XRP"
        },
        {
            step: "03",
            title: "Test RLUSD Stablecoin",
            desc: "To test Ripple's official stablecoin, you must get test RLUSD. Click the blue 'Get RLUSD' link to visit Ripple's faucet. Paste both your Sender and Recipient addresses in their portal to mathematically open the stablecoin trustline. Then, hit Send!",
            color: "#10b981",
            tag: "tryrlusd.com"
        },
        {
            step: "04",
            title: "Immutable Verification",
            desc: "After any transaction, you'll receive a unique TX Hash and an IPFS CID. You can use these to verify your payment live on the XRPL Explorer or retrieve your receipt from the global IPFS gateway.",
            color: "#06b6d4",
            tag: "Pinata IPFS"
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
                        Follow these simple steps to test SubLedger's cutting-edge payment infrastructure.
                    </p>
                </div>

                {/* Vertical Timeline Steps */}
                {steps.map((s, i) => (
                    <div key={i} style={{ display: "flex", gap: "24px", marginBottom: i === steps.length - 1 ? "0" : "32px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{
                                width: "48px", height: "48px", borderRadius: "14px",
                                background: "rgba(5,5,16,0.5)", border: `2px solid ${s.color}60`,
                                color: s.color, display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "16px", fontWeight: 900, fontFamily: "monospace", flexShrink: 0
                            }}>
                                {s.step}
                            </div>
                            {i < steps.length - 1 && (
                                <div style={{
                                    width: "2px", flex: 1,
                                    background: `linear-gradient(to bottom, ${s.color}50, ${steps[i + 1].color}50)`,
                                    marginTop: "12px"
                                }} />
                            )}
                        </div>

                        <div className="glass-card" style={{ flex: 1, padding: "28px" }}>
                            <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px" }}>{s.title}</h3>
                            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, fontSize: "15px", marginBottom: "20px" }}>
                                {s.desc}
                            </p>
                            <span style={{
                                display: "inline-block",
                                padding: "4px 12px", borderRadius: "8px", border: `1px solid ${s.color}40`,
                                background: `${s.color}15`, color: s.color,
                                fontSize: "12px", fontWeight: 700
                            }}>
                                {s.tag}
                            </span>
                        </div>
                    </div>
                ))}

                {/* FAQ/Quick Tips */}
                <div style={{ marginTop: "80px" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "32px", textAlign: "center" }}>Quick Essentials</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#4f7cff" }}>Wait, what is an Escrow?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                An Escrow is a "Smart Contract" that holds funds in a vault. The funds cannot be touched by anyone until the time lock expires.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#10b981" }}>Why do I need a receipt?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                SubLedger gives you IPFS receipts. These are cryptographically signed JSON files stored forever on a decentralized file system.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#06b6d4" }}>The Wallet Manager</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                The **Wallet** page is your command center. Use it to generate accounts, claim free XRP, and check ANY address balance.
                            </p>
                        </div>
                        <div className="glass-card" style={{ padding: "20px" }}>
                            <div style={{ fontWeight: 700, marginBottom: "8px", color: "#7c3aed" }}>Is this on Mainnet?</div>
                            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                                Not yet. We are running on **XRPL Testnet**. Perfect for building and testing without real-world financial risk!
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
