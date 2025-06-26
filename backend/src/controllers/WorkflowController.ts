import { Request, Response } from "express";
import { generatorWorkflow } from "../agent/generatorWorkflow";
import { GeminiIA } from "../services/GeminiIA";
import { ServiceService } from "../services/ServiceService";

export interface CreateWorkflowDTO {
  prompt: string;
}

export class WorkflowController {
    private serviceService: ServiceService;
    
    constructor() {
        this.serviceService = new ServiceService();
    }

    public createWorkflow = async (req: Request, res: Response) => {
        const createServiceDto: CreateWorkflowDTO = req.body;
        const {prompt} = createServiceDto;
        const tags = await this.serviceService.getAllUniqueTags()
        const workflow = await generatorWorkflow(prompt, tags, new GeminiIA())

        res.status(201).json({
            success: true,
            message: "Workflow created successfully",
            data: workflow,
        });
    }
}