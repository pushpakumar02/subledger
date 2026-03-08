"use client";

import { useState } from "react";
import { Icons, CopyBtn, SubscriptionResult, WalletType } from "@/components/Shared";
import Link from "next/link";

export default function Create() {
    const [paymentMode, setPaymentMode] = useState<"escrow" | "rlusd">("escrow");
    const [wallet, setWallet] = useState<WalletType | null>(null);
    const [fundingWallet, setFundingWallet] = useState(false);

    const [form, setForm] = useState({
        senderSeed: "",
        recipientAddress: "",
        amountXRP: "5",
        description: "",
        intervalDays: "30",
    });

    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<SubscriptionResult | null>(null);
    const [error, setError] = useState<string>("");

    const fundWallet = async () => {
        setFundingWallet(true);
        try {
            const res = await fetch("/api/fund-wallet", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setWallet(data);
                setForm(f => ({ ...f, senderSeed: data.seed }));
            } else {
                setError(data.error || "Failed to fund wallet");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setFundingWallet(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        setResult(null);
        try {
            const endpoint = paymentMode === "rlusd" ? "/api/send-rlusd" : "/api/create-subscription";
            const body = paymentMode === "rlusd"
                ? { senderSeed: form.senderSeed, recipientAddress: form.recipientAddress, amountRLUSD: parseFloat(form.amountXRP), description: form.description || "SubLedger RLUSD Subscription" }
                : { senderSeed: form.senderSeed, recipientAddress: form.recipientAddress, amountXRP: parseFloat(form.amountXRP), description: form.description || "SubLedger Subscription", intervalDays: parseInt(form.intervalDays) };
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.success) {
                setResult(data);
            } else {
                setError(data.error || "Transaction failed");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (result) {
        return (
            <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
                <div className="slide-up" style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>
                    <div className="glass-card" style={{
                        padding: "24px", border: "1px solid rgba(16,185,129,0.3)",
                        background: "rgba(16,185,129,0.05)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: "50%",
                                background: "rgba(16,185,129,0.2)", border: "1px solid rgba(16,185,129,0.4)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "#10b981",
                            }}><Icons.Check /></div>
                            <span style={{ fontWeight: 700, fontSize: "16px", color: "#10b981" }}>Subscription Created On-Chain!</span>
                        </div>

                        <div style={{ display: "grid", gap: "10px" }}>
                            {[
                                { label: "TX Hash", value: result.txHash, link: result.explorerUrl },
                                result.ipfsCid && { label: "IPFS Receipt CID", value: result.ipfsCid, link: result.pinataUrl || undefined },
                                { label: "Sender", value: result.senderAddress },
                            ].filter(Boolean).map((item: any, i) => (
                                <div key={i} style={{
                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                                    borderRadius: "8px", padding: "12px 16px",
                                    display: "grid", gridTemplateColumns: "130px 1fr auto 20px", alignItems: "center", gap: "12px",
                                }}>
                                    <span style={{ color: "var(--text-secondary)", fontSize: "13px" }}>{item.label}</span>
                                    <span style={{
                                        fontFamily: "monospace", fontSize: "13px", color: "var(--text-primary)",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                    }}>{item.value}</span>
                                    <CopyBtn text={item.value} />
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {item.link && (
                                            <a href={item.link} target="_blank" rel="noopener noreferrer"
                                                style={{ color: "#4f7cff", display: "flex" }}><Icons.Link /></a>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                            <button className="btn-primary" onClick={() => setResult(null)} style={{ padding: "12px 24px" }}>
                                Create Another
                            </button>
                            <Link href="/" style={{
                                textDecoration: "none", color: "var(--text-primary)", fontWeight: 600,
                                padding: "12px 24px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)",
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
            <div className="slide-up" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
                <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
                    Create a <span className="gradient-text">Subscription</span>
                </h2>
                <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "24px", fontSize: "15px" }}>
                    Pay with RLUSD stablecoin or lock funds in XRPL smart escrow.
                </p>

                {/* Payment Mode Toggle */}
                <div style={{
                    display: "flex", gap: "8px", marginBottom: "28px",
                    background: "rgba(255,255,255,0.04)", borderRadius: "12px", padding: "4px",
                    border: "1px solid rgba(255,255,255,0.08)",
                }}>
                    {(["escrow", "rlusd"] as const).map(mode => (
                        <button key={mode} onClick={() => setPaymentMode(mode)} style={{
                            flex: 1, padding: "10px", borderRadius: "10px", border: "none",
                            cursor: "pointer", fontWeight: 600, fontSize: "13px", transition: "all 0.2s",
                            background: paymentMode === mode ? (mode === "rlusd" ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#4f7cff,#7c3aed)") : "transparent",
                            color: paymentMode === mode ? "white" : "var(--text-secondary)",
                        }}>
                            {mode === "rlusd" ? "💵 RLUSD Payment (Ripple Stablecoin)" : "🔒 XRP Smart Escrow"}
                        </button>
                    ))}
                </div>

                {/* RLUSD info banner */}
                {paymentMode === "rlusd" && (
                    <div style={{
                        padding: "12px 16px", marginBottom: "20px", borderRadius: "10px",
                        background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.25)",
                        fontSize: "13px", color: "#10b981", display: "flex", alignItems: "center", gap: "10px",
                    }}>
                        <span style={{ fontSize: "20px" }}>💵</span>
                        <div>
                            <strong>RLUSD</strong> — Ripple's USD stablecoin on XRPL Testnet. SubLedger auto-sets the trust line then sends the payment.
                            <div style={{ marginTop: "4px", color: "#10b981", fontWeight: 500 }}>
                                ⚠️ Important: Both the Sender and Recipient wallets MUST be manually funded with test RLUSD first before subscribing. <a href="https://tryrlusd.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4f7cff", whiteSpace: "nowrap" }}>Get RLUSD here →</a>
                            </div>
                        </div>
                    </div>
                )}
                {paymentMode === "escrow" && (
                    <div style={{
                        padding: "12px 16px", marginBottom: "20px", borderRadius: "10px",
                        background: "rgba(79,124,255,0.08)", border: "1px solid rgba(79,124,255,0.2)",
                        fontSize: "13px", color: "#4f7cff", display: "flex", alignItems: "center", gap: "10px",
                    }}>
                        <span style={{ fontSize: "20px" }}>🔒</span>
                        <div><strong>Smart Escrow</strong> — Funds are time-locked on XRPL. Auto-release to recipient after the interval. Trustless &amp; on-chain.</div>
                    </div>
                )}

                {/* Wallet helper */}
                {!wallet && (
                    <div className="glass-card" style={{
                        padding: "16px 20px", marginBottom: "24px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        border: "1px solid rgba(245,158,11,0.2)",
                    }}>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>Need a test wallet?</div>
                            <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Get 100 test XRP from faucet instantly</div>
                        </div>
                        <button className="btn-primary" onClick={() => { fundWallet(); }} disabled={fundingWallet}
                            style={{ padding: "10px 18px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                            {fundingWallet ? <Icons.Spinner /> : <Icons.Wallet />}
                            {fundingWallet ? "Funding..." : "Get Wallet"}
                        </button>
                    </div>
                )}

                {wallet && (
                    <div className="glass-card" style={{
                        padding: "14px 18px", marginBottom: "24px",
                        border: "1px solid rgba(16,185,129,0.25)",
                        display: "flex", alignItems: "center", gap: "12px",
                    }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: "10px",
                            background: "rgba(16,185,129,0.15)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#10b981",
                        }}><Icons.Wallet /></div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Connected Wallet · {wallet.balance} XRP</div>
                            <div style={{ fontFamily: "monospace", fontSize: "12px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {wallet.address}
                            </div>
                        </div>
                        <span className="badge-active">Funded</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "28px", display: "grid", gap: "18px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
                            Your Secret Seed (Sender) *
                        </label>
                        <input className="input-field" required
                            value={form.senderSeed}
                            onChange={e => setForm(f => ({ ...f, senderSeed: e.target.value }))}
                            placeholder="sEdtxxxxxxxxxxxxxxxxxx (your XRPL secret)"
                            type="password"
                        />
                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                            ⚠️ Use Testnet seeds only. Never share Mainnet seeds.
                        </div>
                    </div>

                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "8px" }}>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                                Recipient Address *
                            </label>
                            <button type="button" onClick={() => setForm(f => ({ ...f, recipientAddress: "rG3iQkU3uGyDwqYwXzCM19AxxqhnhuaoLi" }))}
                                style={{
                                    background: "rgba(79,124,255,0.1)", border: "1px solid rgba(79,124,255,0.2)",
                                    borderRadius: "4px", color: "#4f7cff", fontSize: "10px", padding: "2px 6px",
                                    cursor: "pointer", fontWeight: 600, transition: "background 0.2s"
                                }}>
                                Use Demo Address
                            </button>
                        </div>
                        <input className="input-field" required
                            value={form.recipientAddress}
                            onChange={e => setForm(f => ({ ...f, recipientAddress: e.target.value }))}
                            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: paymentMode === "rlusd" ? "1fr" : "1fr 1fr", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
                                Amount ({paymentMode === "rlusd" ? "RLUSD $" : "XRP"}) *
                            </label>
                            <div style={{ position: "relative" }}>
                                <input className="input-field" required type="number" min="0.01" step="0.01"
                                    value={form.amountXRP}
                                    onChange={e => setForm(f => ({ ...f, amountXRP: e.target.value }))}
                                    style={{ paddingRight: "70px" }}
                                />
                                <span style={{
                                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                                    fontSize: "12px", fontWeight: 700,
                                    color: paymentMode === "rlusd" ? "#10b981" : "#4f7cff",
                                }}>{paymentMode === "rlusd" ? "RLUSD" : "XRP"}</span>
                            </div>
                        </div>
                        {paymentMode === "escrow" && (
                            <div>
                                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
                                    Interval (Days) *
                                </label>
                                <select className="input-field"
                                    value={form.intervalDays}
                                    onChange={e => setForm(f => ({ ...f, intervalDays: e.target.value }))}
                                    style={{ cursor: "pointer" }}>
                                    <option value="7">Weekly (7 days)</option>
                                    <option value="14">Bi-weekly (14 days)</option>
                                    <option value="30">Monthly (30 days)</option>
                                    <option value="90">Quarterly (90 days)</option>
                                    <option value="365">Yearly (365 days)</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
                            Description
                        </label>
                        <input className="input-field"
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="e.g. Monthly newsletter subscription"
                        />
                    </div>

                    {error && (
                        <div style={{
                            padding: "12px 16px",
                            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)",
                            borderRadius: "8px", color: "#ef4444", fontSize: "13px",
                        }}>
                            ❌ {error}
                        </div>
                    )}

                    <button className="btn-primary" type="submit" disabled={submitting}
                        style={{
                            padding: "16px", fontSize: "16px", fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            opacity: submitting ? 0.7 : 1,
                            background: paymentMode === "rlusd" ? "linear-gradient(135deg,#10b981,#059669)" : undefined,
                        }}>
                        {submitting
                            ? <><Icons.Spinner /> {paymentMode === "rlusd" ? "Sending RLUSD..." : "Creating Escrow..."}</>
                            : <><Icons.Zap /> {paymentMode === "rlusd" ? "Send RLUSD Subscription" : "Lock in XRP Escrow"}</>}
                    </button>
                </form>
            </div>
        </main>
    );
}
