import { Node, Edge, NodeTypes } from 'reactflow';

export interface WorkflowNodeData {
  label: string;
  description?: string;
  config?: any;
  formFields?: FormField[];
  approvers?: string[];
}

export interface FormField {
  id: string;
  name: string;
  type: 'text' | 'email' | 'number' | 'select' | 'textarea' | 'date';
  label: string;
  required: boolean;
  options?: string[];
  validation?: any;
}

export interface WorkflowNode extends Node {
  data: WorkflowNodeData;
}

export interface WorkflowEdge extends Edge {
  data?: {
    condition?: string;
    label?: string;
  };
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'active' | 'inactive';
}

export type WorkflowNodeType = 'start' | 'end' | 'form' | 'approval' | 'condition' | 'action';

export interface NodeTemplate {
  type: WorkflowNodeType;
  label: string;
  icon: React.ReactNode;
  description: string;
  defaultData: WorkflowNodeData;
}
