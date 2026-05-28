import express from "express";
import cors from "cors";

import solarRoutes from "./routes/solarRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/solar", solarRoutes);
app.use("/api/report", pdfRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

export default app;