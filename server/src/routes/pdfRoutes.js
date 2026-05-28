import express from "express";
import { generateSolarReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/export-pdf",
    protect,
    generateSolarReport
);

export default router;