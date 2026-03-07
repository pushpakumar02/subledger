import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { receiptData, txHash } = await req.json();

        const PINATA_JWT = process.env.PINATA_JWT;

        if (!PINATA_JWT) {
            return NextResponse.json({ error: "Pinata JWT not configured" }, { status: 500 });
        }

        // Pin JSON to Pinata
        const pinataResponse = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${PINATA_JWT}`,
            },
            body: JSON.stringify({
                pinataContent: receiptData,
                pinataMetadata: {
                    name: `SubLedger-Receipt-${txHash?.slice(0, 8) || "unknown"}`,
                    keyvalues: {
                        app: "subledger",
                        type: "payment_receipt",
                        tx_hash: txHash || "",
                    },
                },
                pinataOptions: {
                    cidVersion: 1,
                },
            }),
        });

        if (!pinataResponse.ok) {
            const errText = await pinataResponse.text();
            throw new Error(`Pinata error: ${errText}`);
        }

        const pinataData = await pinataResponse.json();

        return NextResponse.json({
            success: true,
            cid: pinataData.IpfsHash,
            url: `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`,
        });
    } catch (error: any) {
        console.error("Pin receipt error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
