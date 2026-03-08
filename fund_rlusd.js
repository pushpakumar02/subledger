const xrpl = require("xrpl");

const issuer = "rLUSDtykL2NVz3HJe1Jqoc7dsxWFVcsmuK";
const currency = "524C555344000000000000000000000000000000";

async function main() {
    const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
    await client.connect();

    // 1. Sender
    const sender = xrpl.Wallet.fromSeed("sEdVhJ2MMR4cDaKKNU9VB1LPuXt8kzf"); // rJij7GVMQyCGVmGjLAc2D7UgKupswbaZvg
    
    // 2. Recipient
    const recipient = xrpl.Wallet.fromSeed("sEdVP3gTpJPFAzzdQU5Rcm9Me9mo428"); // rN5oXuSEUWmDbSHYXJ2wPydCKBtDSazzjv

    for (const w of [sender, recipient]) {
        console.log(`Setting TrustLine for ${w.address}...`);
        const trustTx = {
            TransactionType: "TrustSet",
            Account: w.address,
            LimitAmount: {
                currency,
                issuer,
                value: "1000000"
            }
        };
        const prepared = await client.autofill(trustTx);
        const signed = w.sign(prepared);
        const result = await client.submitAndWait(signed.tx_blob);
        console.log(`${w.address} TrustLine: ${result.result.meta.TransactionResult}`);
    }

    // Now try to fund from the issuer faucet!
    console.log("Unfortunately, only the official faucet can issue test RLUSD. Passing the trustlines fixes the SubLedger UI though!");
    
    await client.disconnect();
}

main().catch(console.error);
