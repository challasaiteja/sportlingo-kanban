import { TaskStatus, TaskPriority } from '@/lib/supabase/types'

export interface ColumnDef {
  id: TaskStatus
  title: string
  color: string
  emptyMessage: string
}

export const COLUMNS: ColumnDef[] = [
  { id: 'todo', title: 'To Do', color: '#6366f1', emptyMessage: 'No tasks yet. Add one to get started!' },
  { id: 'in_progress', title: 'In Progress', color: '#f59e0b', emptyMessage: 'Drag tasks here when you start working.' },
  { id: 'in_review', title: 'In Review', color: '#8b5cf6', emptyMessage: 'Move tasks here when they need review.' },
  { id: 'done', title: 'Done', color: '#10b981', emptyMessage: 'Completed tasks will appear here.' },
]

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string; bgColor: string }> = {
  none: { label: 'None', color: '#94a3b8', bgColor: '#f1f5f9' },
  low: { label: 'Low', color: '#3b82f6', bgColor: '#eff6ff' },
  medium: { label: 'Medium', color: '#eab308', bgColor: '#fefce8' },
  high: { label: 'High', color: '#f97316', bgColor: '#fff7ed' },
  urgent: { label: 'Urgent', color: '#ef4444', bgColor: '#fef2f2' },
}

export const LABEL_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#64748b',
]
