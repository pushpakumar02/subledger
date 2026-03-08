import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return NextResponse.json({
                result: {
                    amount: 10,
                    intervalDays: 30,
                    description: prompt || "Monthly subscription",
                    suggestion: "⚠️ Gemini API key not configured. Add GEMINI_API_KEY to .env.local and restart.",
                },
            });
        }

        const systemPrompt = `You are SubLedger's AI assistant. Help users set up recurring crypto payments on XRPL using RLUSD (a USD stablecoin) or XRP.

Given a user's natural language description, extract:
1. Amount as a NUMBER — if user says "$10" or "10 dollars" or "10 USD", use 10. If they say "5 XRP", use 5. Default: 10.
2. Interval in days — 7=weekly, 14=biweekly, 30=monthly, 90=quarterly, 365=yearly. Default: 30.
3. A clean 1-sentence description of the subscription.
4. A friendly 1-2 sentence confirmation message.

Examples:
- "monthly $10 subscription" → amount:10, intervalDays:30
- "weekly 5 XRP newsletter" → amount:5, intervalDays:7
- "$25 quarterly coaching" → amount:25, intervalDays:90

Respond ONLY with valid JSON (no markdown, no backticks):
{"amount":<number>,"intervalDays":<number>,"description":"<string>","suggestion":"<string>"}

User's request: "${prompt}"`;

        // Call Gemini REST API directly (avoids SDK network issues)
        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: systemPrompt }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 200 },
                }),
            }
        );

        if (!geminiRes.ok) {
            const errText = await geminiRes.text();
            throw new Error(`Gemini API error ${geminiRes.status}: ${errText.slice(0, 100)}`);
        }

        const geminiData = await geminiRes.json();
        const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

        if (!text) throw new Error("Empty response from Gemini");

        // Strip markdown fences if present
        const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error(`Could not parse: ${text.slice(0, 80)}`);

        const parsed = JSON.parse(jsonMatch[0]);
        if (!parsed.amount || !parsed.intervalDays) throw new Error("Missing required fields in AI response");

        return NextResponse.json({ result: parsed });

    } catch (error: any) {
        console.error("AI assist error:", error.message);

        // Smart fallback: try to extract amount from prompt manually
        const promptText = (await req.json().catch(() => ({ prompt: "" })))?.prompt || "";
        const dollarMatch = promptText.match(/\$\s*(\d+(?:\.\d+)?)/);
        const xrpMatch = promptText.match(/(\d+(?:\.\d+)?)\s*xrp/i);
        const amount = dollarMatch ? parseFloat(dollarMatch[1]) : xrpMatch ? parseFloat(xrpMatch[1]) : 10;

        return NextResponse.json({
            result: {
                amount,
                intervalDays: 30,
                description: "Monthly subscription",
                suggestion: `Using smart defaults (amount: ${amount}). AI temporarily unavailable: ${error.message?.slice(0, 60) || "network error"}`,
            },
        });
    }
}
