"use client";

import { Icons, FeatureCard, StatCard } from "@/components/Shared";

export default function HowItWorks() {
    return (
        <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
            <div className="slide-up" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
                <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
                    Getting <span className="gradient-text">Started</span>
                </h2>
                <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "40px" }}>
                    Follow these simple steps to test SubLedger's cutting-edge payment infrastructure.
                </p>

                {/* Steps */}
                {[
                    {
                        step: "01", color: "#4f7cff",
                        title: "Get a Test Wallet",
                        desc: "Go to the 'Wallet' tab and click 'Get Wallet'. The XRPL Testnet instantly generates a real wallet for you and funds it with 100 free test XRP. This is your 'Sender' wallet.",
                        tech: "Testnet Faucet",
                    },
                    {
                        step: "02", color: "#7c3aed",
                        title: "Test 'XRP Smart Escrow'",
                        desc: "Go to the 'Create' tab. Click the 'Use Demo Address' button to instantly fill in a Recipient. Since your wallet organically holds native XRP, you can immediately hit 'Lock in XRP Escrow' to see your funds securely locked on-chain!",
                        tech: "Native XRP",
                    },
                    {
                        step: "03", color: "#10b981",
                        title: "Test 'RLUSD Stablecoin'",
                        desc: "To test Ripple's official stablecoin, you must get test RLUSD. Click the blue 'Get RLUSD' link to visit Ripple's faucet. Paste both your Sender and Recipient addresses in their portal to mathematically open the stablecoin trustline. Then, hit Send!",
                        tech: "tryrlusd.com",
                    },
                    {
                        step: "04", color: "#06b6d4",
                        title: "View your immuntable receipt",
                        desc: "Instantly after sending a payment or escrow, SubLedger uploads a structured JSON receipt directly to the decentralized IPFS network. You can copy the IPFS CID or view the raw TX Hash live on the XRPL Explorer!",
                        tech: "Pinata IPFS",
                    },
                ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "20px", marginBottom: "32px" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: "14px", flexShrink: 0,
                                background: `${item.color}20`, border: `2px solid ${item.color}50`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 900, fontSize: "14px", color: item.color,
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}>{item.step}</div>
                            {i < 3 && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${item.color}40, transparent)`, marginTop: "8px" }} />}
                        </div>
                        <div className="glass-card" style={{ flex: 1, padding: "20px", marginBottom: i < 3 ? "0" : undefined }}>
                            <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "8px" }}>{item.title}</div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, marginBottom: "12px" }}>
                                {item.desc}
                            </div>
                            <span style={{
                                fontSize: "11px", fontWeight: 600, borderRadius: "10px",
                                padding: "4px 12px", color: item.color,
                                background: `${item.color}15`, border: `1px solid ${item.color}30`,
                            }}>{item.tech}</span>
                        </div>
                    </div>
                ))}

                {/* Architecture diagram */}
                <div className="glass-card" style={{ padding: "28px", marginTop: "16px" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "20px", textAlign: "center" }}>Tech Stack</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: "12px" }}>
                        {[
                            { name: "XRPL", desc: "On-chain escrow & settlement", color: "#4f7cff", icon: "⚡" },
                            { name: "Pinata", desc: "IPFS receipt pinning", color: "#f59e0b", icon: "📌" },
                            { name: "RLUSD", desc: "Ripple Stablecoin support", color: "#10b981", icon: "💵" },
                            { name: "Next.js", desc: "Full-stack web app", color: "#7c3aed", icon: "⚙️" },
                        ].map((t, i) => (
                            <div key={i} style={{
                                background: `${t.color}08`, border: `1px solid ${t.color}20`,
                                borderRadius: "10px", padding: "16px", textAlign: "center",
                            }}>
                                <div style={{ fontSize: "24px", marginBottom: "6px" }}>{t.icon}</div>
                                <div style={{ fontWeight: 700, color: t.color, marginBottom: "4px" }}>{t.name}</div>
                                <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{t.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
