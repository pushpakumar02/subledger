import { NextRequest, NextResponse } from "next/server";
import * as xrpl from "xrpl";

export async function POST(req: NextRequest) {
    try {
        const { address } = await req.json();

        if (!address) {
            return NextResponse.json({ error: "Address required" }, { status: 400 });
        }

        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

        let balance = "0";
        let transactions: any[] = [];

        try {
            const accountInfo = await client.request({
                command: "account_info",
                account: address,
                ledger_index: "validated",
            });
            balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);
        } catch (e) {
            // Account might not exist yet
            balance = "0";
        }

        try {
            const txHistory = await client.request({
                command: "account_tx",
                account: address,
                limit: 10,
            });
            transactions = txHistory.result.transactions || [];
        } catch (e) {
            transactions = [];
        }

        await client.disconnect();

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
