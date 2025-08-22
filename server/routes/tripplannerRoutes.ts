import express from "express";
import { plantrip } from "../controllers/tripController";

const router = express.Router();

router.post("/plantrip", plantrip);

export default router;
