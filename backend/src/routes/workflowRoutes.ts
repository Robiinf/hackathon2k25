import { Router } from "express";
import { WorkflowController } from "../controllers/WorkflowController";

const router = Router();
const controller = new WorkflowController();

router.post("/", controller.createWorkflow);

export default router;
