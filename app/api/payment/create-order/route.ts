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
      return Response.json(
        { error: "Please log in to purchase premium" },
        { status: 401 }
      );
    }

    // Get user from database
    await connectDB();
    const user = (await User.findOne({ email: session.user.email })) as {
      _id: any;
      email: string;
    };

    if (!user) {
      return Response.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // Call backend with authenticated user ID
    const response = await axios.post(
      "http://localhost:5000/api/payment/create-order",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user._id.toString(),
        },
      }
    );

    return Response.json(response.data);
  } catch (error) {
    console.error("Create order error:", error);
    if (axios.isAxiosError(error) && error.response) {
      return Response.json(error.response.data, {
        status: error.response.status,
      });
    }
    return Response.json({ error: "Failed to create order" }, { status: 500 });
  }
}
