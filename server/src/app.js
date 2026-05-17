import express from "express";
import cors from "cors";

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Test Route
app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});


// Export App
export default app;
