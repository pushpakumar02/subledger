import { NextRequest, NextResponse } from "next/server";

const XRPL_TESTNET = "https://s.altnet.rippletest.net:51234";
const XRPL_FAUCET = "https://faucet.altnet.rippletest.net/accounts";

async function xrplRequest(method: string, params: any) {
    const res = await fetch(XRPL_TESTNET, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, params: [params] }),
    });
    const json = await res.json();
    return json.result;
}

export async function POST(req: NextRequest) {
    try {
        // Use XRPL testnet faucet REST API
        const faucetRes = await fetch(XRPL_FAUCET, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
        });

        if (!faucetRes.ok) {
            throw new Error(`Faucet error: ${faucetRes.status}`);
        }

        const faucetData = await faucetRes.json();

        const address = faucetData.account?.address || faucetData.account?.classicAddress;
        const seed = faucetData.seed || faucetData.account?.secret; // Fix: seed is top-level
        const balance = faucetData.amount || 100; // Faucet now gives 100

        if (!address || !seed) {
            throw new Error("Faucet did not return a valid wallet");
        }

        return NextResponse.json({
            success: true,
            address,
            seed,
            balance,
            explorerUrl: `https://testnet.xrpl.org/accounts/${address}`,
        });
    } catch (error: any) {
        console.error("Fund wallet error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
