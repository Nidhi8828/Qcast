import { signIn } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const result = await signIn("credentials", { email, password, redirect: false });

    if (!result || result.error) {
      return NextResponse.json({ error: result?.error || "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ message: "Signed in successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



