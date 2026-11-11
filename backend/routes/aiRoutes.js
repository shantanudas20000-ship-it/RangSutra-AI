import express from "express";

import {
    directionsController,
    rewriteController,
    improveController
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/generate-directions", directionsController);
router.post("/rewrite", rewriteController);
router.post("/improve", improveController);

export default router;