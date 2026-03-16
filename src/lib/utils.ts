import clsx, { ClassValue } from 'clsx'
import { differenceInDays, parseISO, isValid } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export type DueDateUrgency = 'overdue' | 'due-soon' | 'upcoming' | 'normal' | null

export function getDueDateUrgency(dueDateStr: string | null): DueDateUrgency {
  if (!dueDateStr) return null
  const dueDate = parseISO(dueDateStr)
  if (!isValid(dueDate)) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = differenceInDays(dueDate, today)

  if (diff < 0) return 'overdue'
  if (diff <= 2) return 'due-soon'
  if (diff <= 7) return 'upcoming'
  return 'normal'
}

export function formatDueDate(dueDateStr: string | null): string {
  if (!dueDateStr) return ''
  const dueDate = parseISO(dueDateStr)
  if (!isValid(dueDate)) return ''

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = differenceInDays(dueDate, today)

  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff <= 7) return `Due in ${diff}d`
  return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
