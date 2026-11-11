import {
    generateDirections,
    rewriteText,
    improveText
} from "../services/geminiService.js";

export async function directionsController(req, res, next) {
    try {
        const { title, idea, category, language, instructions } = req.body;

        if (!idea || typeof idea !== "string" || !idea.trim()) {
            return res.status(400).json({
                error: "Please provide a valid original idea."
            });
        }

        if (idea.length > 5000) {
            return res.status(400).json({
                error: "Idea must be under 5000 characters."
            });
        }

        const result = await generateDirections({
            title: String(title || "").slice(0, 120),
            idea: idea.trim(),
            category: String(category || "Story").slice(0, 50),
            language: String(language || "English").slice(0, 30),
            instructions: String(instructions || "").slice(0, 1000)
        });

        res.json(result);

    } catch (error) {
        next(error);
    }
}

export async function rewriteController(req, res, next) {
    try {
        const { text, instruction, language } = req.body;

        if (!text || typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                error: "Please provide text to rewrite."
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({
                error: "Text must be under 5000 characters."
            });
        }

        const result = await rewriteText({
            text: text.trim(),
            instruction: String(instruction || "").slice(0, 500),
            language: String(language || "English").slice(0, 30)
        });

        res.json(result);

    } catch (error) {
        next(error);
    }
}

export async function improveController(req, res, next) {
    try {
        const { text, language } = req.body;

        if (!text || typeof text !== "string" || !text.trim()) {
            return res.status(400).json({
                error: "Please provide text to improve."
            });
        }

        if (text.length > 5000) {
            return res.status(400).json({
                error: "Text must be under 5000 characters."
            });
        }

        const result = await improveText({
            text: text.trim(),
            language: String(language || "English").slice(0, 30)
        });

        res.json(result);

    } catch (error) {
        next(error);
    }
}