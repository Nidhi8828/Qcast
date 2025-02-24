import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body;
    if(token)
    {
        console.log(token);
    }

    if (!token) {
      return NextResponse.json(
        { success: false, error: "CAPTCHA validation is required" },
        { status: 400 }
      );
    }

    // const secretKey = process.env.TURNSTILE_SECRET_KEY; 
    const secretKey = "0x4AAAAAAA8xm-P-1jqsZ8jKOpN6cPP2eqw";
    const verificationUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    const verificationResponse = await fetch(verificationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey || "",
        response: token,
      }),
    });

    const verificationResult = await verificationResponse.json();

    if (verificationResult.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: verificationResult["error-codes"] || "CAPTCHA validation failed",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("CAPTCHA validation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
