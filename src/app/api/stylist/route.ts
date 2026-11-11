
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, conversationContext, wardrobeContext } =
      await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A valid message is required." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash-lite",
});
    const result = await model.generateContent(`
You are a luxury AI fashion stylist.

User wardrobe:
${wardrobeContext || "No wardrobe information available."}

Previous conversation:
${conversationContext || "No previous conversation."}

Current request:
${message}

Give stylish, premium, personalized fashion advice.
`);

    const response = await result.response;

    return NextResponse.json({
      reply: response.text(),
    });
  } catch (error) {
    console.error("Stylist API error:", error);

    return NextResponse.json(
      { error: "Unable to generate a response. Please try again." },
      { status: 500 }
    );
  }
}
