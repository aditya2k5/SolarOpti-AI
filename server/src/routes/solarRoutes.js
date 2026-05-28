import express from "express";
import { calculateSolar } from "../controllers/solarController.js";
// 1. Import your secure auth middleware guard
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// 2. Add 'protect' as the middle argument to guard this endpoint
router.post("/calculate", protect, calculateSolar);

export default router;