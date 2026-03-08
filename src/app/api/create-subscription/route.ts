import { NextRequest, NextResponse } from "next/server";
import { pinReceiptToIPFS } from "@/lib/pinata";

const XRPL_TESTNET = "https://s.altnet.rippletest.net:51234";

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

// Convert XRP to drops
function xrpToDrops(xrp: number): string {
  return String(Math.floor(xrp * 1_000_000));
}

// XRPL epoch offset (seconds between Unix epoch and XRPL epoch)
const XRPL_EPOCH_OFFSET = 946684800;

// Derive wallet from seed using xrpl derivation (we'll use the fetch-based ripple keypairs approach)
async function deriveWallet(seed: string) {
  // Dynamically import xrpl only for key derivation (no network calls)
  const xrpl = await import("xrpl");
  const wallet = xrpl.Wallet.fromSeed(seed);
  return wallet;
}

// Sign and encode transaction
async function signTx(txJson: any, seed: string) {
  const xrpl = await import("xrpl");
  const wallet = xrpl.Wallet.fromSeed(seed);

  // Get account info for sequence number
  const accountInfo = await xrplRequest("account_info", {
    account: wallet.address,
    ledger_index: "current",
  });

  const sequence = accountInfo.account_data.Sequence;

  // Get current ledger
  const ledger = await xrplRequest("ledger_current", {});
  const currentLedger = ledger.ledger_current_index;

  const finishAfter = Math.floor(Date.now() / 1000) - XRPL_EPOCH_OFFSET + (txJson.intervalDays * 24 * 60 * 60);
  const cancelAfter = finishAfter + (30 * 24 * 60 * 60);

  const tx = {
    TransactionType: "EscrowCreate",
    Account: wallet.address,
    Amount: xrpToDrops(txJson.amountXRP),
    Destination: txJson.recipientAddress,
    FinishAfter: finishAfter,
    CancelAfter: cancelAfter,
    Sequence: sequence,
    Fee: "12",
    LastLedgerSequence: currentLedger + 20,
    Flags: 0,
  };

  const signed = wallet.sign(tx as any);
  return { signed, wallet, sequence };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderSeed, recipientAddress, amountXRP, description, intervalDays } = body;

    if (!senderSeed || !recipientAddress || !amountXRP) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Sign transaction
    const { signed, wallet, sequence } = await signTx(
      { amountXRP: parseFloat(amountXRP), recipientAddress, intervalDays: parseInt(intervalDays) },
      senderSeed
    );

    // Submit transaction
    const submitResult = await xrplRequest("submit", {
      tx_blob: signed.tx_blob,
    });

    if (submitResult.engine_result !== "tesSUCCESS" &&
      submitResult.engine_result !== "terQUEUED" &&
      !submitResult.engine_result?.startsWith("tes")) {
      throw new Error(`Transaction failed: ${submitResult.engine_result_message || submitResult.engine_result}`);
    }

    const txHash = signed.hash;

    // Build receipt
    const receiptData = {
      subledger_version: "1.0.0",
      type: "subscription_escrow",
      description: description || "SubLedger Subscription",
      sender: wallet.address,
      recipient: recipientAddress,
      amount_xrp: amountXRP,
      interval_days: intervalDays,
      tx_hash: txHash,
      escrow_sequence: sequence,
      created_at: new Date().toISOString(),
      network: "XRPL Testnet",
      engine_result: submitResult.engine_result,
    };

    // Pin to Pinata
    let ipfsCid = null;
    try {
      ipfsCid = await pinReceiptToIPFS(receiptData, txHash);
    } catch (e) {
      console.error("Pinata error (non-fatal):", e);
    }

    return NextResponse.json({
      success: true,
      txHash,
      senderAddress: wallet.address,
      sequence,
      engineResult: submitResult.engine_result,
      ipfsCid,
      explorerUrl: `https://testnet.xrpl.org/transactions/${txHash}`,
      pinataUrl: ipfsCid ? `https://gateway.pinata.cloud/ipfs/${ipfsCid}` : null,
    });
  } catch (error: any) {
    console.error("Create subscription error:", error);
    return NextResponse.json({ error: error.message || "Failed to create subscription" }, { status: 500 });
  }
}
