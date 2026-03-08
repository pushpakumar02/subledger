"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icons } from "./Shared";

export function Navigation() {
    const pathname = usePathname();

    const tickerItems = [
        "⚡ XRPL Testnet LIVE", "🔒 IPFS Verified Receipts", "💵 Stablecoin Support",
        "💸 Near-Zero Fees", "🌍 Borderless Payments", "📱 No Bank Required",
        "⚡ XRPL Testnet LIVE", "🔒 IPFS Verified Receipts", "💵 Stablecoin Support",
        "💸 Near-Zero Fees", "🌍 Borderless Payments", "📱 No Bank Required",
    ];

    return (
        <>
            {/* NAV */}
            <nav style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                background: "rgba(5,5,16,0.85)", backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(79,124,255,0.12)",
                padding: "0 24px", height: "64px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
                <Link href="/" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: "10px",
                        background: "linear-gradient(135deg, #4f7cff, #7c3aed)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, fontSize: "18px", color: "white",
                    }}>S</div>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px" }}>
                        Sub<span className="gradient-text">Ledger</span>
                    </span>
                </Link>

                <div style={{ display: "flex", gap: "6px" }}>
                    {[
                        { href: "/", label: "Home" },
                        { href: "/create", label: "Create" },
                        { href: "/wallet", label: "Wallet" },
                        { href: "/how-it-works", label: "How It Works" },
                    ].map(tab => (
                        <Link key={tab.href} href={tab.href}
                            style={{
                                textDecoration: "none",
                                display: "inline-block",
                                padding: "8px 16px", borderRadius: "8px", border: "none",
                                cursor: "pointer", fontWeight: 500, fontSize: "14px",
                                transition: "all 0.2s",
                                background: pathname === tab.href ? "rgba(79,124,255,0.2)" : "transparent",
                                color: pathname === tab.href ? "#4f7cff" : "var(--text-secondary)",
                                borderBottom: pathname === tab.href ? "2px solid #4f7cff" : "2px solid transparent",
                            }}>
                            {tab.label}
                        </Link>
                    ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#10b981", boxShadow: "0 0 8px #10b981",
                    }} />
                    <span style={{ color: "#10b981", fontSize: "13px", fontWeight: 600 }}>Testnet Live</span>
                </div>
            </nav>

            {/* TICKER */}
            <div style={{
                position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
                background: "rgba(5,5,16,0.90)", backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(79,124,255,0.1)",
                height: "36px", overflow: "hidden", display: "flex", alignItems: "center",
            }}>
                <div style={{ position: "absolute", inset: 0, background: "rgba(79,124,255,0.05)", zIndex: -1 }} />
                <div className="ticker-track" style={{ display: "flex", gap: "48px", whiteSpace: "nowrap", paddingLeft: "48px" }}>
                    {tickerItems.map((item, i) => (
                        <span key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", flexShrink: 0 }}>{item}</span>
                    ))}
                </div>
            </div>
        </>
    );
}
