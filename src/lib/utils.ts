import clsx, { ClassValue } from 'clsx'
import { differenceInDays, parseISO, isValid } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export type DueDateUrgency = 'overdue' | 'due-soon' | 'upcoming' | 'normal' | null

function parseDueDate(dueDateStr: string | null): { dueDate: Date; diff: number } | null {
  if (!dueDateStr) return null
  const dueDate = parseISO(dueDateStr)
  if (!isValid(dueDate)) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return { dueDate, diff: differenceInDays(dueDate, today) }
}

export function getDueDateUrgency(dueDateStr: string | null): DueDateUrgency {
  const parsed = parseDueDate(dueDateStr)
  if (!parsed) return null

  if (parsed.diff < 0) return 'overdue'
  if (parsed.diff <= 2) return 'due-soon'
  if (parsed.diff <= 7) return 'upcoming'
  return 'normal'
}

export function formatDueDate(dueDateStr: string | null): string {
  const parsed = parseDueDate(dueDateStr)
  if (!parsed) return ''

  const { dueDate, diff } = parsed
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  if (diff <= 7) return `Due in ${diff}d`
  return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
