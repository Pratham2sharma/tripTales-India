import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import axios from "axios";
import { connectDB } from "../../../server/lib/db";
import User from "../../../server/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get user from database to get the actual user ID
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    // Forward the request with user info in headers (simulating Express middleware)
    const response = await axios.post(
      "http://localhost:5000/api/trip/plantrip",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id.toString(), // Pass user ID in header
        },
      }
    );

    return Response.json(response.data);
  } catch (error: unknown) {
    console.error("Generate trip error:", error);
    if (axios.isAxiosError(error) && error.response) {
      return Response.json(error.response.data, {
        status: error.response.status,
      });
    }
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
