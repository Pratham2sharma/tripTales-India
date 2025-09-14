import { Request, Response } from "express";
import User from "../models/User.js";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [totalUsers, premiumUsers, revenueResult] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        "subscription.plan": "premium",
      }),

      // 3. Calculate total revenue based on premium plan users
      User.aggregate([
        {
          // Find users with premium subscription
          $match: {
            "subscription.plan": "premium",
          },
        },
        {
          // Count premium users and calculate revenue
          $group: {
            _id: null,
            premiumCount: { $sum: 1 },
          },
        },
        {
          // Calculate total revenue by multiplying count by 50
          $addFields: {
            totalRevenue: { $multiply: ["$premiumCount", 50] },
          },
        },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Debug logging
    // console.log("Analytics Debug:", {
    //   totalUsers,
    //   premiumUsers,
    //   revenueResult,
    //   totalRevenue,
    // });

    res.json({
      totalUsers,
      premiumUsers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
};
