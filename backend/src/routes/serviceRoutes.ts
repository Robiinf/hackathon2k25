import { Router } from "express";
import { ServiceController } from "../controllers/ServiceController";
import { TagController } from "../controllers/tagController";

const router = Router();
const serviceController = new ServiceController();
const tagController = new TagController();

// Routes principales
router.post("/services", serviceController.createService);
router.get("/services", serviceController.getAllServices);
router.get("/services/search", serviceController.searchServices);
router.get("/services/tags", serviceController.getServicesByTags);
router.get("/services/type/:type", serviceController.getServicesByType);
router.get("/services/:id", serviceController.getServiceById);
router.put("/services/:id", serviceController.updateService);
router.delete("/services/:id", serviceController.deleteService);
router.get("/tags", tagController.getAllUniqueTags);

// Routes pour les notes
router.post("/services/:id/notes", serviceController.addNoteToService);

export default router;
