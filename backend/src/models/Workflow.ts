import mongoose, { Schema } from "mongoose";

export interface WorkflowNode {
  order: number;
  jobTitle: string;
  serviceId: mongoose.Types.ObjectId;
  params: Record<string, any>;
  tags?: string[];
}

export interface IWorkflow extends Document {
  name: string;
  description: string;
  prompt: string;
  nodes: WorkflowNode[];
  createdAt: Date;
  updatedAt: Date;
}

const WorkflowNodeSchema = new Schema({
  order: { type: Number, required: true },
  jobTitle: { type: String, required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
  params: { type: Schema.Types.Mixed, default: {} },
  tags: [{ type: String }]
});

const WorkflowSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    prompt: { type: String, required: true, trim: true },
    nodes: [WorkflowNodeSchema]
  },
  { timestamps: true }
);

export const Workflow = mongoose.model<IWorkflow>('Workflow', WorkflowSchema);