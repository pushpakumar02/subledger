import { NextRequest, NextResponse } from "next/server";
import * as xrpl from "xrpl";

export async function POST(req: NextRequest) {
    try {
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

        // Generate a new funded testnet wallet
        const { wallet, balance } = await client.fundWallet();

        await client.disconnect();

        return NextResponse.json({
            success: true,
            address: wallet.address,
            seed: wallet.seed,
            balance: balance,
            explorerUrl: `https://testnet.xrpl.org/accounts/${wallet.address}`,
        });
    } catch (error: any) {
        console.error("Fund wallet error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
