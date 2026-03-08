import { NextRequest, NextResponse } from "next/server";

const XRPL_TESTNET = "https://s.altnet.rippletest.net:51234";

// RLUSD on XRPL Testnet
const RLUSD_ISSUER = "rLUSDtykL2NVz3HJe1Jqoc7dsxWFVcsmuK";
const RLUSD_CURRENCY = "524C555344000000000000000000000000000000"; // "RLUSD" in 40-char hex

async function xrplRequest(method: string, params: any) {
    const res = await fetch(XRPL_TESTNET, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, params: [params] }),
    });
    const json = await res.json();
    if (json.result?.error) throw new Error(json.result.error_message || json.result.error);
    return json.result;
}

export async function POST(req: NextRequest) {
    try {
        const { senderSeed, recipientAddress, amountRLUSD, description } = await req.json();

        if (!senderSeed || !recipientAddress || !amountRLUSD) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const xrpl = await import("xrpl");
        const wallet = xrpl.Wallet.fromSeed(senderSeed);

        // Get account info for sequence
        const accountInfo = await xrplRequest("account_info", {
            account: wallet.address,
            ledger_index: "current",
        });
        const sequence = accountInfo.account_data.Sequence;

        // Get current ledger
        const ledger = await xrplRequest("ledger_current", {});
        const currentLedger = ledger.ledger_current_index;

        // Step 1: Set up trust line for sender (TrustSet)
        const trustTx = {
            TransactionType: "TrustSet",
            Account: wallet.address,
            LimitAmount: {
                currency: RLUSD_CURRENCY,
                issuer: RLUSD_ISSUER,
                value: "1000000",
            },
            Sequence: sequence,
            Fee: "12",
            LastLedgerSequence: currentLedger + 20,
            Flags: 0,
        };

        const signedTrust = wallet.sign(trustTx as any);
        const trustResult = await xrplRequest("submit", { tx_blob: signedTrust.tx_blob });
        console.log("TrustSet result:", trustResult.engine_result);

        // Step 2: Send RLUSD Payment
        // Get updated sequence
        const accountInfo2 = await xrplRequest("account_info", {
            account: wallet.address,
            ledger_index: "current",
        });
        const sequence2 = accountInfo2.account_data.Sequence;
        const ledger2 = await xrplRequest("ledger_current", {});

        const paymentTx = {
            TransactionType: "Payment",
            Account: wallet.address,
            Destination: recipientAddress,
            Amount: {
                currency: RLUSD_CURRENCY,
                issuer: RLUSD_ISSUER,
                value: String(amountRLUSD),
            },
            SendMax: {
                currency: RLUSD_CURRENCY,
                issuer: RLUSD_ISSUER,
                value: String(parseFloat(amountRLUSD) * 1.01), // 1% slippage
            },
            Memos: description ? [
                {
                    Memo: {
                        MemoData: Buffer.from(description, 'utf8').toString('hex').toUpperCase(),
                    }
                }
            ] : undefined,
            Sequence: sequence2,
            Fee: "12",
            LastLedgerSequence: ledger2.ledger_current_index + 20,
            Flags: 0,
        };

        const signedPayment = wallet.sign(paymentTx as any);
        const paymentResult = await xrplRequest("submit", { tx_blob: signedPayment.tx_blob });

        if (!paymentResult.engine_result?.startsWith("tes") && paymentResult.engine_result !== "terQUEUED") {
            throw new Error(`Payment failed: ${paymentResult.engine_result_message || paymentResult.engine_result}`);
        }

        const txHash = signedPayment.hash;

        // Pin receipt to Pinata
        let ipfsCid = null;
        try {
            const receiptData = {
                subledger_version: "1.0.0",
                type: "rlusd_subscription_payment",
                description: description || "SubLedger RLUSD Subscription",
                sender: wallet.address,
                recipient: recipientAddress,
                amount_rlusd: amountRLUSD,
                currency: "RLUSD",
                issuer: RLUSD_ISSUER,
                tx_hash: txHash,
                trust_tx_hash: signedTrust.hash,
                created_at: new Date().toISOString(),
                network: "XRPL Testnet",
                engine_result: paymentResult.engine_result,
            };

            const origin = req.headers.get("origin") || `https://${req.headers.get("host")}`;
            const pinataRes = await fetch(`${origin}/api/pin-receipt`, {
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
            trustTxHash: signedTrust.hash,
            senderAddress: wallet.address,
            amountRLUSD,
            engineResult: paymentResult.engine_result,
            ipfsCid,
            explorerUrl: `https://testnet.xrpl.org/transactions/${txHash}`,
            pinataUrl: ipfsCid ? `https://gateway.pinata.cloud/ipfs/${ipfsCid}` : null,
        });
    } catch (error: any) {
        console.error("Send RLUSD error:", error);
        return NextResponse.json({ error: error.message || "Failed to send RLUSD" }, { status: 500 });
    }
}
