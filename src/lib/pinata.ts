export async function pinReceiptToIPFS(receiptData: any, txHash: string) {
    const PINATA_JWT = process.env.PINATA_JWT;

    if (!PINATA_JWT) {
        throw new Error("Pinata JWT not configured");
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
    return pinataData.IpfsHash;
}
