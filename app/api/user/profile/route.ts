import { NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectDB } from "../../../../server/lib/db";
import User from "../../../../server/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findOne({ 
      email: session.user.email 
    }).select('planGeneratedCount subscription');

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json({
      planGeneratedCount: user.planGeneratedCount || 0,
      subscription: user.subscription || { plan: "free" }
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
