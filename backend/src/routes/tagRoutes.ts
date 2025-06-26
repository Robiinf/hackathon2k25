import { Router } from "express";
import { TagController } from "../controllers/tagController";

const router = Router();
const tagController = new TagController();

// Routes principales
router.get("/", tagController.getAllUniqueTags);

export default router;
