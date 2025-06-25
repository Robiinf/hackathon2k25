export interface IWorkflowGenerator {
   createWorkflow(prompt : string): Promise<void>;
}