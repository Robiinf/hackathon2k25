import { IWorkflow, Workflow } from '../models/Workflow';

export class WorkflowRepository {
    async create(workflowData: Partial<IWorkflow>): Promise<IWorkflow> {
        console.log("test", workflowData);
        const workflow = new Workflow(workflowData);
        return await workflow.save();
    }

    async findAll(): Promise<IWorkflow[]> {
        return await Workflow.find().sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<IWorkflow | null> {
        return await Workflow.findById(id);
    }

    async update(
        id: string,
        updateData: Partial<IWorkflow>
    ): Promise<IWorkflow | null> {
        return await Workflow.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id: string): Promise<IWorkflow | null> {
        return await Workflow.findByIdAndDelete(id);
    }

    async findByQuery(query: object): Promise<IWorkflow[]> {
        return await Workflow.find(query).sort({ createdAt: -1 });
    }
}