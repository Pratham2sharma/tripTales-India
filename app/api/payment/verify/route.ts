import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "../../../../server/lib/db";
import User from "../../../../server/models/User";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    // Get user from database
    await connectDB();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    
    // Forward to backend with user ID
    const response = await axios.post(
      "http://localhost:5000/api/payment/verify",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id.toString(),
        },
      }
    );

    return Response.json(response.data);
  } catch (error) {
    console.error("Payment verification error:", error);
    if (axios.isAxiosError(error) && error.response) {
      return Response.json(error.response.data, {
        status: error.response.status,
      });
    }
    return Response.json({ error: "Payment verification failed" }, { status: 500 });
  }
}