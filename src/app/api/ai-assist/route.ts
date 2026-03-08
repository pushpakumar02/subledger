import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
                    suggestion: "⚠️ Gemini API key not set — using defaults. Add GEMINI_API_KEY to .env.local and restart the server.",
                },
            });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are SubLedger's AI assistant. Help users set up recurring crypto payments on XRPL using RLUSD (a USD stablecoin) or XRP.

Given a user's natural language description, extract:
1. Amount as a NUMBER — if user says "$10" or "10 dollars" or "10 USD", use 10. If they say "5 XRP", use 5. Default: 10.
2. Interval in days — 7=weekly, 14=biweekly, 30=monthly, 90=quarterly, 365=yearly. Default: 30.
3. A clean 1-sentence description of the subscription.
4. A friendly 1-2 sentence suggestion confirming what you understood.

IMPORTANT: "$10 monthly" means amount=10, intervalDays=30. Never default to 5 unless the user specifically says 5.

Respond ONLY with valid JSON, no markdown, no backticks:
{
  "amount": <number>,
  "intervalDays": <number>,
  "description": "<string>",
  "suggestion": "<friendly confirmation message>"
}

User's request: "${prompt}"`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text().trim();

        // Strip markdown code fences if Gemini wraps in ```json ... ```
        const cleaned = text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();

        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error(`Could not parse AI response: ${text.slice(0, 100)}`);

        const parsed = JSON.parse(jsonMatch[0]);

        // Validate fields
        if (!parsed.amount || !parsed.intervalDays) throw new Error("AI response missing required fields");

        return NextResponse.json({ result: parsed });

    } catch (error: any) {
        console.error("AI assist error:", error.message);
        return NextResponse.json({
            result: {
                amount: 10,
                intervalDays: 30,
                description: "Monthly subscription",
                suggestion: `AI error: ${error.message?.slice(0, 80) || "Unknown error"}. Using defaults — adjust below.`,
            },
        });
    }
}
