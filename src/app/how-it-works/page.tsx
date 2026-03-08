"use client";

import { Icons, FeatureCard, StatCard } from "@/components/Shared";

export default function HowItWorks() {
    return (
        <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
            <div className="slide-up" style={{ maxWidth: "700px", margin: "0 auto", padding: "0 24px" }}>
                <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
                    How <span className="gradient-text">SubLedger</span> Works
                </h2>
                <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "40px" }}>
                    Three technologies, one seamless payment experience.
                </p>

                {/* Steps */}
                {[
                    {
                        step: "01", color: "#4f7cff",
                        title: "Escrow Created or RLUSD Sent",
                        desc: "SubLedger creates an EscrowCreate transaction or RLUSD Payment on the XRP Ledger Testnet. Escrowed funds release automatically when the period completes.",
                        tech: "XRP Ledger Testnet",
                    },
                    {
                        step: "02", color: "#7c3aed",
                        title: "Receipt Pinned to IPFS",
                        desc: "Instantly after the transaction, SubLedger uploads a structured JSON receipt to IPFS via Pinata. This receipt contains the TX hash and details—immutably stored.",
                        tech: "Pinata · IPFS",
                    },
                    {
                        step: "03", color: "#06b6d4",
                        title: "Verify Anywhere",
                        desc: "Share your IPFS CID or XRPL TX hash with anyone. They can verify the payment on the XRPL Explorer or retrieve the receipt. No middleman required.",
                        tech: "XRPL Explorer",
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
                            {i < 2 && <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${item.color}40, transparent)`, marginTop: "8px" }} />}
                        </div>
                        <div className="glass-card" style={{ flex: 1, padding: "20px", marginBottom: i < 2 ? "0" : undefined }}>
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
