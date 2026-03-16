export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'done'
export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  due_date: string | null
  position: number
  user_id: string
  created_at: string
  task_labels?: { label_id: string; labels: Label }[]
}

export interface Label {
  id: string
  name: string
  color: string
  user_id?: string
  created_at?: string
}

export interface TaskLabel {
  task_id: string
  label_id: string
}
