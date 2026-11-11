import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to RangSutra AI API",
        status: "Running"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        aiMode: process.env.GEMINI_API_KEY ? "Gemini" : "Demo"
    });
});

app.use("/api", aiRoutes);

app.use((err, req, res, next) => {
    console.error("API Error:", err.message);

    res.status(500).json({
        error: "AI service is temporarily unavailable. Please try again."
    });
});

app.listen(PORT, () => {
    console.log(`RangSutra AI server running at http://localhost:${PORT}`);
    console.log(
        `AI Mode: ${process.env.GEMINI_API_KEY ? "Gemini" : "Demo"}`
    );
});