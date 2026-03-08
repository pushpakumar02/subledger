"use client";

import { useState } from "react";
import { Icons, CopyBtn, WalletType } from "@/components/Shared";

export default function WalletManager() {
    const [wallet, setWallet] = useState<WalletType | null>(null);
    const [fundingWallet, setFundingWallet] = useState(false);
    const [error, setError] = useState("");

    const [lookupAddress, setLookupAddress] = useState("");
    const [walletInfo, setWalletInfo] = useState<any>(null);
    const [lookingUp, setLookingUp] = useState(false);

    const fundWallet = async () => {
        setFundingWallet(true);
        setError("");
        try {
            const res = await fetch("/api/fund-wallet", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                setWallet(data);
            } else {
                setError(data.error || "Failed to fund wallet");
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setFundingWallet(false);
        }
    };

    const handleLookup = async () => {
        if (!lookupAddress.trim()) return;
        setLookingUp(true);
        setWalletInfo(null);
        try {
            const res = await fetch("/api/wallet-info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ address: lookupAddress }),
            });
            const data = await res.json();
            setWalletInfo(data);
        } catch (e: any) {
            setWalletInfo({ error: e.message });
        } finally {
            setLookingUp(false);
        }
    };

    return (
        <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>
            <div className="slide-up" style={{ maxWidth: "620px", margin: "0 auto", padding: "0 24px" }}>
                <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, marginBottom: "8px" }}>
                    <span className="gradient-text">Wallet</span> Manager
                </h2>
                <p style={{ textAlign: "center", color: "var(--text-secondary)", marginBottom: "32px" }}>
                    Fund a test wallet or look up any XRPL address.
                </p>

                {/* RLUSD section */}
                <div className="glass-card" style={{ padding: "24px", marginBottom: "24px", border: "1px solid rgba(16,185,129,0.25)" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "8px", fontSize: "16px" }}>
                        💵 Get RLUSD (Ripple Stablecoin)
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "16px" }}>
                        RLUSD is Ripple's USD-pegged stablecoin on XRPL. Get testnet RLUSD from the faucet or swap XRP → RLUSD on the XRPL DEX/AMM.
                    </p>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <a href="https://tryrlusd.com" target="_blank" rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                padding: "10px 20px", borderRadius: "10px", textDecoration: "none",
                                background: "linear-gradient(135deg,#10b981,#059669)",
                                color: "white", fontWeight: 600, fontSize: "13px",
                            }}>
                            <Icons.Link /> Get RLUSD from Faucet
                        </a>
                        <a href="https://tryrlusd.com" target="_blank" rel="noopener noreferrer"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: "6px",
                                padding: "10px 20px", borderRadius: "10px", textDecoration: "none",
                                border: "1px solid rgba(16,185,129,0.4)",
                                color: "#10b981", fontWeight: 600, fontSize: "13px",
                            }}>
                            🔄 Swap XRP → RLUSD (DEX/AMM)
                        </a>
                    </div>
                    <div style={{ marginTop: "12px", fontSize: "11px", color: "var(--text-secondary)" }}>
                        Issuer: <code style={{ fontFamily: "monospace", color: "#10b981" }}>rLUSDtykL2NVz3HJe1Jqoc7dsxWFVcsmuK</code>
                    </div>
                </div>

                {/* Fund section */}
                <div className="glass-card" style={{ padding: "28px", marginBottom: "24px" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "8px", fontSize: "16px" }}>
                        🚰 Get a Funded Test Wallet (XRP)
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
                        Generate a new XRPL Testnet wallet with 100 XRP from the official faucet. Use this to test subscriptions.
                    </p>

                    <button className="btn-primary" onClick={fundWallet} disabled={fundingWallet}
                        style={{
                            padding: "14px 28px", fontSize: "15px", width: "100%",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                            opacity: fundingWallet ? 0.7 : 1,
                        }}>
                        {fundingWallet ? <><Icons.Spinner /> Contacting Faucet...</> : <><Icons.Wallet /> Fund New Wallet</>}
                    </button>

                    {error && <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "12px" }}>{error}</div>}

                    {wallet && (
                        <div style={{ marginTop: "20px", display: "grid", gap: "10px" }}>
                            <div style={{
                                background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
                                borderRadius: "10px", padding: "16px",
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <span style={{ fontWeight: 700, color: "#10b981" }}>✅ Wallet Funded!</span>
                                    <span className="badge-active">{wallet.balance} XRP</span>
                                </div>
                                {[
                                    { label: "Address", value: wallet.address },
                                    { label: "Secret Seed", value: wallet.seed },
                                ].map((item, i) => (
                                    <div key={i} style={{ marginBottom: "8px" }}>
                                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", marginBottom: "4px" }}>{item.label}</div>
                                        <div style={{
                                            display: "flex", alignItems: "center", gap: "8px",
                                            background: "rgba(0,0,0,0.3)", borderRadius: "6px", padding: "8px 12px",
                                        }}>
                                            <code style={{ fontSize: "12px", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {item.value}
                                            </code>
                                            <CopyBtn text={item.value} />
                                        </div>
                                    </div>
                                ))}
                                <a href={`https://testnet.xrpl.org/accounts/${wallet.address}`} target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "8px",
                                        color: "#4f7cff", fontSize: "13px", textDecoration: "none",
                                    }}>
                                    <Icons.Link /> View on XRPL Explorer
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Lookup section */}
                <div className="glass-card" style={{ padding: "28px" }}>
                    <h3 style={{ fontWeight: 700, marginBottom: "8px", fontSize: "16px" }}>
                        🔍 Look Up Any Address
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginBottom: "20px" }}>
                        Check XRP balance and recent transactions for any XRPL Testnet address.
                    </p>
                    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                        <input className="input-field"
                            value={lookupAddress}
                            onChange={e => setLookupAddress(e.target.value)}
                            placeholder="rXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                            onKeyDown={e => e.key === "Enter" && handleLookup()}
                        />
                        <button className="btn-primary" onClick={handleLookup} disabled={lookingUp}
                            style={{ padding: "12px 20px", flexShrink: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                            {lookingUp ? <Icons.Spinner /> : "Lookup"}
                        </button>
                    </div>

                    {walletInfo && (
                        <div style={{ display: "grid", gap: "12px" }}>
                            {walletInfo.error ? (
                                <div style={{ color: "#ef4444", fontSize: "13px" }}>Error: {walletInfo.error}</div>
                            ) : (
                                <>
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        background: "rgba(79,124,255,0.06)", border: "1px solid rgba(79,124,255,0.15)",
                                        borderRadius: "10px", padding: "14px 18px",
                                    }}>
                                        <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>XRP Balance</span>
                                        <span style={{ fontWeight: 700, fontSize: "18px" }} className="gradient-text">{walletInfo.balance} XRP</span>
                                    </div>

                                    {walletInfo.transactions?.length > 0 && (
                                        <div>
                                            <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
                                                Recent Transactions
                                            </div>
                                            {walletInfo.transactions.map((tx: any, i: number) => (
                                                <div key={i} style={{
                                                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                                                    borderRadius: "8px", padding: "10px 14px", marginBottom: "6px",
                                                    display: "flex", alignItems: "center", justifyContent: "space-between",
                                                }}>
                                                    <div>
                                                        <div style={{ fontSize: "13px", fontWeight: 600 }}>{tx.type}</div>
                                                        <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontFamily: "monospace" }}>
                                                            {tx.hash?.slice(0, 20)}...
                                                        </div>
                                                    </div>
                                                    {tx.amount && (
                                                        <span style={{ fontSize: "13px", color: "#10b981", fontWeight: 600 }}>
                                                            {typeof tx.amount === "string" ? `${(parseInt(tx.amount) / 1e6).toFixed(2)} XRP` : ""}
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
