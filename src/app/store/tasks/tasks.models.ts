export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export type NewTaskPayload = Pick<Task, 'title' | 'notes'>;
