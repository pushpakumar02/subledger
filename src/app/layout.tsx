import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SubLedger — Recurring Payments for Everyone",
  description: "Stripe-like recurring payments for the unbanked, powered by XRPL. Send and receive crypto subscriptions with AI-assisted setup, IPFS-verified receipts, and real-time on-chain settlement.",
  keywords: "XRPL, XRP Ledger, recurring payments, crypto subscriptions, DeFi, microfinance, RLUSD, Pinata, IPFS",
  openGraph: {
    title: "SubLedger — Recurring Payments for Everyone",
    description: "SubLedger — Decentralized subscription infrastructure powered by XRPL & Pinata",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: "100vh", position: "relative" }}>
          <Navigation />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
