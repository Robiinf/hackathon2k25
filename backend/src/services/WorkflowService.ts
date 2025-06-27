import mongoose from 'mongoose';
import { IWorkflow } from '../models/Workflow';
import { ServiceRepository } from '../repositories/ServiceRepository';
import { WorkflowRepository } from '../repositories/WorkflowRepository';

export interface SaveWorkflowDto {
    name: string;
    description: string;
    prompt: string;
    nodes: {
        order: number;
        jobTitle: string;
        serviceId: string;
        params: Record<string, any>;
        tags?: string[];
    }[];
}

export class WorkflowService {
    private workflowRepository: WorkflowRepository;
    private serviceRepository: ServiceRepository;

    constructor() {
        this.workflowRepository = new WorkflowRepository();
        this.serviceRepository = new ServiceRepository();
    }

    async saveWorkflow(saveWorkflowDto: SaveWorkflowDto): Promise<IWorkflow> {
        // Validation

        // Vérifier l'existence de tous les services
        for (const node of saveWorkflowDto.nodes) {
            const serviceExists = await this.serviceRepository.findById(node.serviceId);
            if (!serviceExists) {
                throw new Error(`Le service avec l'ID ${node.serviceId} n'existe pas`);
            }
        }

        // Préparer les données pour enregistrement
        const workflowData: Partial<IWorkflow> = {
            name: saveWorkflowDto.name,
            description: saveWorkflowDto.description,
            prompt: saveWorkflowDto.prompt,
            nodes: saveWorkflowDto.nodes.map(node => ({
                ...node,
                serviceId: new mongoose.Types.ObjectId(node.serviceId)
            }))
        };



        return await this.workflowRepository.create(workflowData);
    }


    async getAllWorkflows(): Promise<IWorkflow[]> {
        return await this.workflowRepository.findAll();
    }

    async getWorkflowById(id: string): Promise<IWorkflow> {
        const workflow = await this.workflowRepository.findById(id);
        if (!workflow) {
            throw new Error("Workflow non trouvé");
        }
        return workflow;
    }

    async updateWorkflow(id: string, updateWorkflowDto: SaveWorkflowDto): Promise<IWorkflow> {
        // Vérifier si le workflow existe
        const existingWorkflow = await this.getWorkflowById(id);

        // Validation

        // Vérifier l'existence de tous les services
        for (const node of updateWorkflowDto.nodes) {
            const serviceExists = await this.serviceRepository.findById(node.serviceId);
            if (!serviceExists) {
                throw new Error(`Le service avec l'ID ${node.serviceId} n'existe pas`);
            }
        }

        // Préparer les données pour la mise à jour
        const workflowData: Partial<IWorkflow> = {
            name: updateWorkflowDto.name,
            description: updateWorkflowDto.description,
            prompt: updateWorkflowDto.prompt,
            nodes: updateWorkflowDto.nodes.map(node => ({
                ...node,
                serviceId: new mongoose.Types.ObjectId(node.serviceId)
            }))
        };

        const updatedWorkflow = await this.workflowRepository.update(id, workflowData);
        if (!updatedWorkflow) {
            throw new Error("Erreur lors de la mise à jour du workflow");
        }

        return updatedWorkflow;
    }

    async deleteWorkflow(id: string): Promise<void> {
        const deletedWorkflow = await this.workflowRepository.delete(id);
        if (!deletedWorkflow) {
            throw new Error("Workflow non trouvé");
        }
    }
}