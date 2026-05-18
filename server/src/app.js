import express from "express";
import cors from "cors";

import solarRoutes from "./routes/solarRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/solar", solarRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running");
});

export default app;