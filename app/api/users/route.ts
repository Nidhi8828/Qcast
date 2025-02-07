import { NextResponse } from "next/server";
import { db, users } from "@/lib/db";

export async function POST(req: Request) {
    try {
       
        const { email, password, isVerified } = await req.json();

       
        const newUser = await db.insert(users).values({
            email,
            password_hash: password,
            is_verified: isVerified ?? false, 
        });

        return NextResponse.json({ message: "User created successfully!", newUser });
    } catch (error) {
        return NextResponse.json({ error: "Error in creating user!" }, { status: 500 });
    }
}

export async function GET() {
    try {
        
        const allUsers = await db.select().from(users);
        return NextResponse.json(allUsers);
    } catch (error) {
        return NextResponse.json({ error:"Error in creating user!" }, { status: 500 });
    }
}
