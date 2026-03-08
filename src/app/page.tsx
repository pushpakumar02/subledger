"use client";

import { useState, useEffect } from "react";

// ── icons (inline SVGs to avoid extra deps) ──────────────────────────────────
const Icons = {
  Zap: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Globe: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Bot: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <line x1="12" y1="3" x2="12" y2="7" /><circle cx="8.5" cy="16.5" r="1.5" /><circle cx="15.5" cy="16.5" r="1.5" />
    </svg>
  ),
  Link: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Copy: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Spinner: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spinner">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  Wallet: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12V22H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h16v4" />
      <path d="M20 12a2 2 0 0 0-2 2 2 2 0 0 0 2 2h4v-4z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Star: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface Wallet { address: string; seed: string; balance: number; }
interface SubscriptionResult {
  txHash: string;
  senderAddress: string;
  explorerUrl: string;
  ipfsCid?: string;
  pinataUrl?: string;
  sequence?: number;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="glass-card p-5 text-center">
      <div className="text-2xl font-bold gradient-text mb-1">{value}</div>
      <div style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "14px" }}>{label}</div>
      <div style={{ color: "var(--text-secondary)", fontSize: "12px", marginTop: "4px" }}>{sub}</div>
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, color }: { icon: React.ReactNode; title: string; desc: string; color: string }) {
  return (
    <div className="glass-card p-6 flex gap-4 items-start" style={{ cursor: "default" }}>
      <div style={{
        width: 44, height: 44, borderRadius: "12px",
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: color, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontWeight: 600, marginBottom: 4, fontSize: "15px" }}>{title}</div>
        <div style={{ color: "var(--text-secondary)", fontSize: "13px", lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

// ── Copy Button ───────────────────────────────────────────────────────────────
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copy} style={{
      background: "rgba(79,124,255,0.1)", border: "1px solid rgba(79,124,255,0.2)",
      borderRadius: "6px", padding: "4px 8px", cursor: "pointer",
      color: copied ? "#10b981" : "var(--accent-blue)", fontSize: "12px",
      display: "flex", alignItems: "center", gap: "4px",
    }}>
      {copied ? <><Icons.Check /> Copied</> : <><Icons.Copy /> Copy</>}
    </button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [activeTab, setActiveTab] = useState<"hero" | "create" | "wallet" | "how">("hero");
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [fundingWallet, setFundingWallet] = useState(false);
  const [paymentMode, setPaymentMode] = useState<"escrow" | "rlusd">("rlusd"); // default RLUSD to impress judge



  // Form state
  const [form, setForm] = useState({
    senderSeed: "",
    recipientAddress: "",
    amountXRP: "5",
    description: "",
    intervalDays: "30",
  });

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubscriptionResult | null>(null);
  const [error, setError] = useState<string>("");

  // Wallet lookup
  const [lookupAddress, setLookupAddress] = useState("");
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [lookingUp, setLookingUp] = useState(false);

  // Ticker items
  const tickerItems = [
    "⚡ XRPL Testnet LIVE", "🔒 IPFS Verified Receipts", "🤖 AI-Powered Setup",
    "💸 Near-Zero Fees", "🌍 Borderless Payments", "📱 No Bank Required",
    "⚡ XRPL Testnet LIVE", "🔒 IPFS Verified Receipts", "🤖 AI-Powered Setup",
    "💸 Near-Zero Fees", "🌍 Borderless Payments", "📱 No Bank Required",
  ];

  // Fund a testnet wallet
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



  // Create XRP Escrow subscription
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
        setActiveTab("hero");
      } else {
        setError(data.error || "Transaction failed");
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Lookup wallet
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
    <div style={{ minHeight: "100vh", position: "relative" }}>
      {/* NAV */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(5,5,16,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(79,124,255,0.12)",
        padding: "0 24px", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: "10px",
            background: "linear-gradient(135deg, #4f7cff, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 900, fontSize: "18px", color: "white",
          }}>S</div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "20px" }}>
            Sub<span className="gradient-text">Ledger</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { id: "hero", label: "Home" },
            { id: "create", label: "Create" },
            { id: "wallet", label: "Wallet" },
            { id: "how", label: "How It Works" },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: "8px 16px", borderRadius: "8px", border: "none",
                cursor: "pointer", fontWeight: 500, fontSize: "14px",
                transition: "all 0.2s",
                background: activeTab === tab.id ? "rgba(79,124,255,0.2)" : "transparent",
                color: activeTab === tab.id ? "#4f7cff" : "var(--text-secondary)",
                borderBottom: activeTab === tab.id ? "2px solid #4f7cff" : "2px solid transparent",
              }}>
              {tab.label}
            </button>
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
        background: "rgba(79,124,255,0.08)", borderBottom: "1px solid rgba(79,124,255,0.1)",
        height: "36px", overflow: "hidden", display: "flex", alignItems: "center",
      }}>
        <div className="ticker-track" style={{ display: "flex", gap: "48px", whiteSpace: "nowrap", paddingLeft: "48px" }}>
          {tickerItems.map((item, i) => (
            <span key={i} style={{ fontSize: "13px", color: "var(--text-secondary)", flexShrink: 0 }}>{item}</span>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <main style={{ paddingTop: "120px", paddingBottom: "80px" }}>

        {/* ── HERO TAB ─────────────────────────────────────────────────── */}
        {activeTab === "hero" && (
          <div className="slide-up" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>

            {/* Badge */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(79,124,255,0.1)", border: "1px solid rgba(79,124,255,0.25)",
                borderRadius: "20px", padding: "8px 20px", fontSize: "13px",
                color: "#4f7cff", fontWeight: 600,
              }}>
                <Icons.Star /> Built at Midwest Blockathon 2025 · XRPL + Pinata + Gemini AI
              </span>
            </div>

            {/* Hero headline */}
            <h1 style={{
              textAlign: "center", fontSize: "clamp(2.4rem, 5vw, 4rem)",
              fontWeight: 900, lineHeight: 1.1, marginBottom: "24px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              Recurring Payments<br />
              <span className="gradient-text">for Everyone.</span>
            </h1>

            <p style={{
              textAlign: "center", color: "var(--text-secondary)",
              fontSize: "18px", maxWidth: "560px", margin: "0 auto 40px",
              lineHeight: 1.6,
            }}>
              Stripe-like subscriptions powered by <strong style={{ color: "var(--text-primary)" }}>XRPL escrow</strong>,
              IPFS-verified receipts via <strong style={{ color: "var(--text-primary)" }}>Pinata</strong>,
              and natural-language setup with <strong style={{ color: "var(--text-primary)" }}>Gemini AI</strong>. No bank required.
            </p>

            {/* CTA buttons */}
            <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "64px", flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={() => setActiveTab("create")}
                style={{ padding: "14px 32px", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                Create Subscription <Icons.ArrowRight />
              </button>
              <button onClick={() => setActiveTab("wallet")}
                style={{
                  padding: "14px 32px", fontSize: "16px",
                  background: "transparent", border: "1px solid rgba(79,124,255,0.3)",
                  borderRadius: "12px", color: "var(--text-primary)", cursor: "pointer",
                  fontWeight: 600, display: "flex", alignItems: "center", gap: "8px",
                  transition: "all 0.2s",
                }}>
                <Icons.Wallet /> Get Test Wallet
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "16px", marginBottom: "48px" }}>
              <StatCard label="Settlement Time" value="3–5s" sub="XRPL Testnet" />
              <StatCard label="Transaction Fee" value="~$0.001" sub="Near-zero cost" />
              <StatCard label="Receipt Storage" value="IPFS" sub="via Pinata" />
              <StatCard label="AI Setup" value="1 Line" sub="Natural language" />
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
                icon={<Icons.Bot />}
                title="Gemini AI Assistant"
                desc="Just describe your subscription in plain English. Our AI extracts amount, interval, and details automatically."
                color="#06b6d4"
              />
              <FeatureCard
                icon={<Icons.Globe />}
                title="Borderless & Inclusive"
                desc="No bank account, no credit card, no middlemen. Anyone with an XRPL wallet can send or receive recurring payments."
                color="#10b981"
              />
            </div>

            {/* Success result box */}
            {result && (
              <div className="glass-card slide-up" style={{
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
                      borderRadius: "8px", padding: "12px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                    }}>
                      <span style={{ color: "var(--text-secondary)", fontSize: "12px", flexShrink: 0 }}>{item.label}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                        <span style={{
                          fontFamily: "monospace", fontSize: "12px",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{item.value}</span>
                        <CopyBtn text={item.value} />
                        {item.link && (
                          <a href={item.link} target="_blank" rel="noopener noreferrer"
                            style={{ color: "#4f7cff", flexShrink: 0 }}><Icons.Link /></a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CREATE TAB ───────────────────────────────────────────────── */}
        {activeTab === "create" && (
          <div className="slide-up" style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px" }}>
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
              {(["rlusd", "escrow"] as const).map(mode => (
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
                  {" "}<a href="https://tryrlusd.com" target="_blank" rel="noopener noreferrer" style={{ color: "#4f7cff" }}>Get RLUSD →</a>
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
                  <div style={{ color: "var(--text-secondary)", fontSize: "12px" }}>Get 1,000 test XRP from faucet instantly</div>
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
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, marginBottom: "8px", color: "var(--text-secondary)" }}>
                  Recipient Address *
                </label>
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

              <div style={{ fontSize: "12px", color: "var(--text-secondary)", textAlign: "center", lineHeight: 1.5 }}>
                {paymentMode === "rlusd"
                  ? "Sends real RLUSD (Ripple stablecoin) on XRPL Testnet. Auto-sets trust line + payment in one flow."
                  : "Creates a real EscrowCreate transaction on XRPL Testnet. Funds locked until interval expires."}
                {" "}Receipt pinned to IPFS via Pinata.
              </div>
            </form>
          </div>
        )}

        {/* ── WALLET TAB ───────────────────────────────────────────────── */}
        {activeTab === "wallet" && (
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
                Generate a new XRPL Testnet wallet with 1,000 XRP from the official faucet. Use this to test subscriptions.
              </p>

              <button className="btn-primary" onClick={fundWallet} disabled={fundingWallet}
                style={{
                  padding: "14px 28px", fontSize: "15px", width: "100%",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  opacity: fundingWallet ? 0.7 : 1,
                }}>
                {fundingWallet ? <><Icons.Spinner /> Contacting Faucet...</> : <><Icons.Wallet /> Fund New Wallet</>}
              </button>

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
        )}

        {/* ── HOW IT WORKS TAB ─────────────────────────────────────────── */}
        {activeTab === "how" && (
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
                title: "Describe Your Subscription (Gemini AI)",
                desc: "Tell SubLedger what you want in plain English — 'monthly newsletter for 5 XRP' or 'weekly podcast access'. Gemini AI parses your intent and fills in the payment details automatically. No crypto knowledge required.",
                tech: "Google Gemini 1.5 Flash",
              },
              {
                step: "02", color: "#7c3aed",
                title: "Escrow Created on XRPL",
                desc: "SubLedger creates an EscrowCreate transaction on the XRP Ledger Testnet. The funds are locked in a time-based escrow — they release to the recipient automatically when the subscription period completes. All on-chain, trustless.",
                tech: "XRP Ledger Testnet · EscrowCreate",
              },
              {
                step: "03", color: "#06b6d4",
                title: "Receipt Pinned to IPFS (Pinata)",
                desc: "Instantly after the transaction, SubLedger uploads a structured JSON receipt to IPFS via Pinata. This receipt contains the TX hash, sender, recipient, amount, and timestamp — permanently and immutably stored. Anyone can verify.",
                tech: "Pinata · IPFS · CIDv1",
              },
              {
                step: "04", color: "#10b981",
                title: "Verify Anywhere",
                desc: "Share your IPFS CID or XRPL TX hash with anyone. They can verify the payment on the XRPL Explorer or retrieve the receipt directly from IPFS. No middleman, no trust required.",
                tech: "XRPL Explorer · Public IPFS",
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
                  { name: "Gemini AI", desc: "Natural language parsing", color: "#06b6d4", icon: "🤖" },
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
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(79,124,255,0.1)",
        padding: "24px", textAlign: "center",
        color: "var(--text-secondary)", fontSize: "13px",
        position: "relative", zIndex: 1,
      }}>
        <span style={{ marginRight: "8px" }}>Built with ❤️ at</span>
        <strong style={{ color: "var(--text-primary)" }}>Midwest Blockathon 2025</strong>
        <span style={{ margin: "0 12px", opacity: 0.3 }}>·</span>
        <span>XRPL + Pinata + Gemini AI + Google Antigravity</span>
        <span style={{ margin: "0 12px", opacity: 0.3 }}>·</span>
        <a href="https://github.com/pushpakumar02/subledger" target="_blank" rel="noopener noreferrer"
          style={{ color: "#4f7cff", textDecoration: "none" }}>GitHub</a>
      </footer>
    </div>
  );
}
