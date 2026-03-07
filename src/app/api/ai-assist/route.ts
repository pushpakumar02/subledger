import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            // Return a helpful fallback if no API key
            return NextResponse.json({
                result: {
                    amount: 5,
                    intervalDays: 30,
                    description: prompt,
                    suggestion: "I've set up a default monthly subscription of 5 XRP based on your request. You can adjust the amount and interval below.",
                },
            });
        }

        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `You are SubLedger's AI assistant. Help users set up recurring crypto payments on XRPL.
    
Given a user's natural language description, extract:
1. Amount in XRP (reasonable default: 5-100 XRP)
2. Interval in days (7=weekly, 14=biweekly, 30=monthly, 365=yearly)
3. A clean description
4. A friendly suggestion message

Respond ONLY with valid JSON in this exact format:
{
  "amount": <number>,
  "intervalDays": <number>,
  "description": "<string>",
  "suggestion": "<friendly 1-2 sentence message>"
}

User's request: "${prompt}"`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text().trim();

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid AI response format");

        const parsed = JSON.parse(jsonMatch[0]);

        return NextResponse.json({ result: parsed });
    } catch (error: any) {
        console.error("AI assist error:", error);
        return NextResponse.json({
            result: {
                amount: 10,
                intervalDays: 30,
                description: "Monthly subscription",
                suggestion: "I've set up a standard monthly subscription. Adjust the details below to match your needs.",
            },
        });
    }
}
