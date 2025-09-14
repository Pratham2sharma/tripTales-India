import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cineplaceRoutes from "./routes/cineplaceRoutes.js";
import tripplannerRoutes from "./routes/tripplannerRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";

// Load environment variables before using them
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
//app.use(cookieParser());

//app.use("/api/auth", authRoute);
app.use("/api", destinationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
app.use("/api", cineplaceRoutes);
app.use("/api/trip", tripplannerRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api", emailRoutes);

app.listen(PORT, () => {
  console.log("Server is Running on http://localhost:" + PORT);
  connectDB();
});
