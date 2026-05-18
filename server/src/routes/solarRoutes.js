import express from "express";

import {
    calculateSolar
} from "../controllers/solarController.js";

const router = express.Router();

router.post("/calculate", calculateSolar);

export default router;