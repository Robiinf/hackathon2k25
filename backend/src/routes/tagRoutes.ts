import { Router } from "express";
import { TagController } from "../controllers/tagController";

const router = Router();
const tagController = new TagController();

// Routes principales
router.get("/tags", tagController.getAllUniqueTags);

export default router;
