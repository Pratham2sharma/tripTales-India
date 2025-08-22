
import { connectDB } from "@/server/lib/db";
import User from "@/server/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
     try {
        const {username , email , password , role} = await request.json();

        if(!username || !email || !password){
            return NextResponse.json({error: "Username , Email and Password are required"}, {status: 400});
        }

        await connectDB();

        const existingUser = await User.findOne({email});
        if(existingUser){
            return NextResponse.json({error: "User Already Registered"} , {status: 400});
        };

        await User.create({
            username,
            email, 
            password, 
            role: role || 'user' // Default role is 'user'
        });

        return NextResponse.json({message: "User Registered Successfully"}, {status: 201});
     } catch (error) {
        console.error("Registeration Error:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
     }
}