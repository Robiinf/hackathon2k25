import { Router } from "express";
import { ServiceController } from "../controllers/ServiceController";
import { TagController } from "../controllers/tagController";

const router = Router();
const serviceController = new ServiceController();
const tagController = new TagController();

// Routes principales
router.post("/", serviceController.createService);
router.get("/", serviceController.getAllServices);
router.get("/search", serviceController.searchServices);
router.get("/tags", serviceController.getServicesByTags);
router.get("/type/:type", serviceController.getServicesByType);
router.get("/:id", serviceController.getServiceById);
router.put("/:id", serviceController.updateService);
router.delete("/:id", serviceController.deleteService);

// Routes pour les notes
router.post("/:id/notes", serviceController.addNoteToService);

export default router;
