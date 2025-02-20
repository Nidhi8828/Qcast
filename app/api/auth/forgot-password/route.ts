import {db} from "@/lib/db";
import {users} from "@/lib/models/users";
import jwt from "jsonwebtoken";
import {sendResetPasswordEmail} from "@/lib/resetPasswordEmail";
import { eq } from 'drizzle-orm';
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try{
        const {email} = await req.json();

        if(!email){
            return NextResponse.json({error: "Email is required"}, {status: 400});
        }

        const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);

        let user = userResult.length ? userResult[0] : null;

        if(!user){
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_SECRET!,{
            expiresIn: "15m",
        } )

        await sendResetPasswordEmail(user.email, token);

        return NextResponse.json({ error: "Resent link sent to your email" }, { status: 200 });
    }catch(error){
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }   
}
