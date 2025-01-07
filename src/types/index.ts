import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: Date;
  status: 'todo' | 'in_progress' | 'done';
  user_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
  };
} 