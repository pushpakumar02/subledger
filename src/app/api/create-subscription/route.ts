import { NextRequest, NextResponse } from "next/server";
import * as xrpl from "xrpl";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { senderSeed, recipientAddress, amountXRP, description, intervalDays } = body;

        if (!senderSeed || !recipientAddress || !amountXRP) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Connect to XRPL Testnet
        const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
        await client.connect();

        const senderWallet = xrpl.Wallet.fromSeed(senderSeed);

        // Get current ledger info
        const ledgerInfo = await client.request({ command: "ledger_current" });
        const currentLedger = ledgerInfo.result.ledger_current_index;

        // Escrow finish time = now + intervalDays in seconds
        const finishAfterSeconds = Math.floor(Date.now() / 1000) + intervalDays * 24 * 60 * 60 - 946684800;
        const cancelAfterSeconds = finishAfterSeconds + 30 * 24 * 60 * 60; // cancel after 30 extra days

        const amountDrops = xrpl.xrpToDrops(amountXRP.toString());

        // Create EscrowCreate transaction
        const escrowCreate: xrpl.EscrowCreate = {
            TransactionType: "EscrowCreate",
            Account: senderWallet.address,
            Amount: amountDrops,
            Destination: recipientAddress,
            FinishAfter: finishAfterSeconds,
            CancelAfter: cancelAfterSeconds,
            LastLedgerSequence: currentLedger + 20,
            Fee: "12",
        };

        const prepared = await client.autofill(escrowCreate);
        const signed = senderWallet.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);

        await client.disconnect();

        const txHash = signed.hash;
        const sequence = (result.result.tx_json as any).Sequence;

        // Pin receipt to Pinata via our pinata API route
        const receiptData = {
            flowpay_version: "1.0.0",
            type: "subscription_escrow",
            description,
            sender: senderWallet.address,
            recipient: recipientAddress,
            amount_xrp: amountXRP,
            interval_days: intervalDays,
            tx_hash: txHash,
            escrow_sequence: sequence,
            created_at: new Date().toISOString(),
            network: "XRPL Testnet",
        };

        // Pin to Pinata
        let ipfsCid = null;
        try {
            const pinataRes = await fetch(`${req.nextUrl.origin}/api/pin-receipt`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiptData, txHash }),
            });
            const pinataJson = await pinataRes.json();
            ipfsCid = pinataJson.cid;
        } catch (e) {
            console.error("Pinata error (non-fatal):", e);
        }

        return NextResponse.json({
            success: true,
            txHash,
            senderAddress: senderWallet.address,
            sequence,
            ipfsCid,
            explorerUrl: `https://testnet.xrpl.org/transactions/${txHash}`,
            pinataUrl: ipfsCid ? `https://gateway.pinata.cloud/ipfs/${ipfsCid}` : null,
        });
    } catch (error: any) {
        console.error("Create subscription error:", error);
        return NextResponse.json({ error: error.message || "Failed to create subscription" }, { status: 500 });
    }
}
