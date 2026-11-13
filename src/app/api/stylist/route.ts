
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/firebase/admin";
import { stylistRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 32 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 1. Verify Firebase authentication
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const idToken = authorization.slice(7).trim();

    if (!idToken) {
      return NextResponse.json(
        { error: "Invalid authentication token." },
        { status: 401 }
      );
    }

   let decodedToken;

try {
  decodedToken = await adminAuth.verifyIdToken(idToken, true);
} catch {
  return NextResponse.json(
    { error: "Invalid or expired authentication token." },
    { status: 401 }
  );
}

// Rate limit each authenticated user
const { success, limit, remaining, reset } =
  await stylistRateLimit.limit(decodedToken.uid);

if (!success) {
  return NextResponse.json(
    {
      error: "Too many requests. Please try again later.",
      retryAfter: Math.max(1, Math.ceil((reset - Date.now()) / 1000)),
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      },
    }
  );
}

    // 2. Check request size
    const contentLengthHeader = request.headers.get("content-length");

    if (contentLengthHeader !== null) {
      const contentLength = Number(contentLengthHeader);

      if (
        !Number.isFinite(contentLength) ||
        contentLength < 0 ||
        contentLength > MAX_BODY_SIZE
      ) {
        return NextResponse.json(
          { error: "Request size is invalid or too large." },
          { status: 413 }
        );
      }
    }

    const rawBody = await request.text();

    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_SIZE) {
      return NextResponse.json(
        { error: "Request payload is too large." },
        { status: 413 }
      );
    }

    // 3. Parse and validate request
    let body;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const { message, conversationContext, wardrobeContext } = body;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return NextResponse.json(
        { error: "Message must contain 1–4000 characters." },
        { status: 400 }
      );
    }
    if (message.length > 1000) {
  return NextResponse.json(
    { error: "Message cannot exceed 1,000 characters." },
    { status: 400 }
  );
}

    if (
      conversationContext !== undefined &&
      (typeof conversationContext !== "string" ||
        conversationContext.length > 12000)
    ) {
      return NextResponse.json(
        { error: "Invalid conversation context." },
        { status: 400 }
      );
    }

    if (
      wardrobeContext !== undefined &&
      (typeof wardrobeContext !== "string" ||
        wardrobeContext.length > 12000)
    ) {
      return NextResponse.json(
        { error: "Invalid wardrobe context." },
        { status: 400 }
      );
    }

    // 4. Check Gemini API configuration
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    // 5. Generate AI stylist response
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
