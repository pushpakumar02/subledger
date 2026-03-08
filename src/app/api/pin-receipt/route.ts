import { NextRequest, NextResponse } from "next/server";
import { pinReceiptToIPFS } from "@/lib/pinata";

export async function POST(req: NextRequest) {
    try {
        const { receiptData, txHash } = await req.json();
        const cid = await pinReceiptToIPFS(receiptData, txHash);

        return NextResponse.json({
            success: true,
            cid,
            url: `https://gateway.pinata.cloud/ipfs/${cid}`,
        });
    } catch (error: any) {
        console.error("Pin receipt error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
