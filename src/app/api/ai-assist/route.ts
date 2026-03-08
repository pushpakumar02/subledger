import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Smart local parser — works even without Gemini API key
function parseLocally(prompt: string) {
    const lower = prompt.toLowerCase();

    // Extract amount — look for $10, 10 RLUSD, 10 XRP, 10 dollars, etc.
    let amount = 10; // sensible default
    const amountMatch =
        prompt.match(/\$\s*(\d+(?:\.\d+)?)/i) ||       // $10, $ 10
        prompt.match(/(\d+(?:\.\d+)?)\s*(?:rlusd|usd|dollars?)/i) || // 10 RLUSD, 10 USD
        prompt.match(/(\d+(?:\.\d+)?)\s*(?:xrp)/i) ||  // 10 XRP
        prompt.match(/(\d+(?:\.\d+)?)/);                // any number
    if (amountMatch) amount = parseFloat(amountMatch[1]);

    // Extract interval
    let intervalDays = 30;
    if (/\bweekly\b|every\s*week|\bweek\b/.test(lower)) intervalDays = 7;
    else if (/\bbiweekly\b|bi.weekly\b|every\s*2\s*weeks?|fortnightly/.test(lower)) intervalDays = 14;
    else if (/\bmonthly\b|every\s*month|\bmonth\b/.test(lower)) intervalDays = 30;
    else if (/\bquarterly\b|every\s*3\s*months?/.test(lower)) intervalDays = 90;
    else if (/\byearly\b|annual|every\s*year/.test(lower)) intervalDays = 365;

    const intervalLabel = { 7: "weekly", 14: "bi-weekly", 30: "monthly", 90: "quarterly", 365: "yearly" }[intervalDays] || "monthly";

    // Clean description
    const description = prompt.trim().replace(/\b(my|a|an|the)\b\s*/gi, "").trim();
    const capitalized = description.charAt(0).toUpperCase() + description.slice(1);

    const suggestion = `✅ Parsed: $${amount} ${intervalLabel} subscription. Interval set to ${intervalDays} days. Adjust below if needed.`;

    return { amount, intervalDays, description: capitalized, suggestion };
}

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            // No API key — use local smart parser
            const parsed = parseLocally(prompt);
            return NextResponse.json({ result: parsed });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are SubLedger's AI assistant. Help users set up recurring crypto payments on XRPL.
    
Given a user's natural language description, extract:
1. Amount as a number (e.g. "$10" → 10, "5 RLUSD" → 5, "50 XRP" → 50)
2. Interval in days (7=weekly, 14=biweekly, 30=monthly, 90=quarterly, 365=yearly)
3. A clean short description
4. A friendly 1-sentence confirmation message showing what you parsed

Respond ONLY with valid JSON in this exact format:
{
  "amount": <number>,
  "intervalDays": <number>,
  "description": "<string>",
  "suggestion": "<friendly confirmation>"
}

User's request: "${prompt}"`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text().trim();

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid AI response format");

        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({ result: parsed });

    } catch (error: any) {
        console.error("AI assist error:", error);
        // Fallback to local parser on any error
        const { prompt } = await req.json().catch(() => ({ prompt: "" }));
        return NextResponse.json({ result: parseLocally(prompt || "monthly subscription") });
    }
}
