import { Router } from 'express';
import { WorkflowController } from '../controllers/WorkflowController';

const router = Router();
const workflowController = new WorkflowController();

// Routes pour les workflows
router.post('/generate', workflowController.createWorkflow);
router.post('/', workflowController.saveWorkflow);
router.get('/', workflowController.getAllWorkflows);
router.get('/:id', workflowController.getWorkflowById);
router.put('/:id', workflowController.updateWorkflow);
router.delete('/:id', workflowController.deleteWorkflow);

export default router;