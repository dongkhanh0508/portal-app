export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';
  assignee?: User;
  reporter: User;
  labels: string[];
  storyPoints?: number;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
  attachments: Attachment[];
  subtasks: SubTask[];
  epic?: string;
  sprint?: string;
  type: 'story' | 'bug' | 'task' | 'epic';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignee?: User;
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
  color: string;
  limit?: number;
}

export interface Board {
  id: string;
  name: string;
  description?: string;
  columns: Column[];
  tasks: { [key: string]: Task };
  createdAt: Date;
  updatedAt: Date;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed';
  taskIds: string[];
}

export interface Epic {
  id: string;
  name: string;
  description: string;
  color: string;
  status: 'planning' | 'in-progress' | 'done';
  taskIds: string[];
}
