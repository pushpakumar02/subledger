import { NextRequest, NextResponse } from "next/server";

const XRPL_TESTNET = "https://s.altnet.rippletest.net:51234";

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
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: "Address required" }, { status: 400 });
        }

        let balance = "0";
        let transactions: any[] = [];

        // Get account info
        try {
            const accountInfo = await xrplRequest("account_info", {
                account: address,
                ledger_index: "validated",
            });
            if (accountInfo?.account_data?.Balance) {
                balance = String(parseInt(accountInfo.account_data.Balance) / 1_000_000);
            }
        } catch (e) {
            balance = "0";
        }

        // Get transaction history
        try {
            const txHistory = await xrplRequest("account_tx", {
                account: address,
                limit: 10,
            });
            transactions = txHistory?.transactions || [];
        } catch (e) {
            transactions = [];
        }

        return NextResponse.json({
            success: true,
            address,
            balance,
            transactions: transactions.slice(0, 5).map((t: any) => ({
                hash: t.tx?.hash || t.tx_json?.hash,
                type: t.tx?.TransactionType || t.tx_json?.TransactionType,
                amount: t.tx?.Amount || t.tx_json?.Amount,
                date: t.tx?.date || t.tx_json?.date,
            })),
        });
    } catch (error: any) {
        console.error("Wallet info error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
