const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface WorkflowNode {
  order: number;
  jobTitle: string;
  serviceId: string;
  params: Record<string, any>;
  tags?: string[];
}

export interface Workflow {
  _id: string;
  name: string;
  description: string;
  prompt: string;
  nodes: WorkflowNode[];
  createdAt: string;
  updatedAt: string;
}

export async function saveWorkflow(workflowData: {
  name: string;
  description: string;
  prompt: string;
  nodes: any[];
  selectedServices?: Record<string, { service: any; params: any }>;
}): Promise<{ success: boolean; data?: any; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/workflows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workflowData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Erreur HTTP: ${response.status}`
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement du workflow:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la sauvegarde du workflow'
    };
  }
}

export async function getWorkflows(): Promise<{ success: boolean; data?: Workflow[]; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/workflows`);
    
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Erreur HTTP: ${response.status}`
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error: any) {
    console.error('Erreur lors de la récupération des workflows:', error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la récupération des workflows'
    };
  }
}

export async function getWorkflowById(id: string): Promise<{ success: boolean; data?: Workflow; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/workflows/${id}`);
    
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Erreur HTTP: ${response.status}`
      };
    }

    return {
      success: true,
      data: data.data
    };
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du workflow ${id}:`, error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la récupération du workflow'
    };
  }
}

export async function deleteWorkflow(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_URL}/api/workflows/${id}`, {
      method: 'DELETE'
    });
    
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Erreur HTTP: ${response.status}`
      };
    }

    return {
      success: true,
      message: 'Workflow supprimé avec succès'
    };
  } catch (error: any) {
    console.error(`Erreur lors de la suppression du workflow ${id}:`, error);
    return {
      success: false,
      message: error.message || 'Erreur lors de la suppression du workflow'
    };
  }
}