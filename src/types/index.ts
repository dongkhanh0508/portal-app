// Workflow Types
export interface WorkflowNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end';
  label: string;
  position: { x: number; y: number };
  data?: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: Date;
  updatedAt: Date;
}

// Widget Types
export interface Widget {
  id: string;
  type: 'chart' | 'table' | 'metric' | 'text';
  title: string;
  config: any;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface Dashboard {
  id: string;
  name: string;
  widgets: Widget[];
  createdAt: Date;
  updatedAt: Date;
}

// Backlog Types
export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in-progress' | 'review' | 'done';
  assignee?: string;
  estimatedHours?: number;
  createdAt: Date;
  updatedAt: Date;
}
