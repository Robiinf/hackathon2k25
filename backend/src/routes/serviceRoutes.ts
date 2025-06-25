import { Router } from "express";
import { ServiceController } from "../controllers/ServiceController";

const router = Router();
const serviceController = new ServiceController();

// Routes principales
router.post("/services", serviceController.createService);
router.get("/services", serviceController.getAllServices);
router.get("/services/:id", serviceController.getServiceById);
router.put("/services/:id", serviceController.updateService);
router.delete("/services/:id", serviceController.deleteService);

// Routes pour les notes
router.post("/services/:id/notes", serviceController.addNoteToService);

export default router;
