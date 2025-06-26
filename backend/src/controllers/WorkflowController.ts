import { Request, Response } from 'express';
import { SaveWorkflowDto, WorkflowService } from '../services/WorkflowService';

export class WorkflowController {
    private workflowService: WorkflowService;

    constructor() {
        this.workflowService = new WorkflowService();
    }

    // POST /api/workflows
    saveWorkflow = async (req: Request, res: Response): Promise<void> => {
        try {
            const saveWorkflowDto: SaveWorkflowDto = req.body;
            const workflow = await this.workflowService.saveWorkflow(saveWorkflowDto);

            res.status(201).json({
                success: true,
                message: "Workflow enregistré avec succès",
                data: workflow
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : "Erreur lors de l'enregistrement du workflow",
                data: null
            });
        }
    };

    // GET /api/workflows
    getAllWorkflows = async (req: Request, res: Response): Promise<void> => {
        try {
            const workflows = await this.workflowService.getAllWorkflows();

            res.status(200).json({
                success: true,
                message: "Workflows récupérés avec succès",
                data: workflows,
                count: workflows.length
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "Erreur lors de la récupération des workflows",
                data: null
            });
        }
    };

    // GET /api/workflows/:id
    getWorkflowById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const workflow = await this.workflowService.getWorkflowById(id);

            res.status(200).json({
                success: true,
                message: "Workflow récupéré avec succès",
                data: workflow
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message === "Workflow non trouvé" ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Erreur lors de la récupération du workflow",
                data: null
            });
        }
    };

    // PUT /api/workflows/:id
    updateWorkflow = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const updateWorkflowDto: SaveWorkflowDto = req.body;
            const workflow = await this.workflowService.updateWorkflow(id, updateWorkflowDto);

            res.status(200).json({
                success: true,
                message: "Workflow mis à jour avec succès",
                data: workflow
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message === "Workflow non trouvé" ? 404 : 400;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Erreur lors de la mise à jour du workflow",
                data: null
            });
        }
    };

    // DELETE /api/workflows/:id
    deleteWorkflow = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            await this.workflowService.deleteWorkflow(id);

            res.status(200).json({
                success: true,
                message: "Workflow supprimé avec succès",
                data: null
            });
        } catch (error) {
            const statusCode = error instanceof Error && error.message === "Workflow non trouvé" ? 404 : 500;
            res.status(statusCode).json({
                success: false,
                message: error instanceof Error ? error.message : "Erreur lors de la suppression du workflow",
                data: null
            });
        }
    };
}