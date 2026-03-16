'use client'

import { useMemo } from 'react'
import Chip from '@mui/material/Chip'
import { Task } from '@/types'
import { getDueDateUrgency } from '@/lib/utils'

interface BoardStatsProps {
  tasks: Task[]
}

export function BoardStats({ tasks }: BoardStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'done').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const overdue = tasks.filter(t =>
      t.status !== 'done' && getDueDateUrgency(t.due_date) === 'overdue'
    ).length

    return { total, completed, inProgress, overdue }
  }, [tasks])

  if (stats.total === 0) return null

  return (
    <div className="flex items-center gap-2">
      <Chip label={`${stats.total} tasks`} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
      <Chip label={`${stats.completed} done`} size="small" variant="outlined" sx={{ fontSize: '0.75rem', color: '#10b981', borderColor: '#10b98140' }} />
      {stats.inProgress > 0 && (
        <Chip label={`${stats.inProgress} active`} size="small" variant="outlined" sx={{ fontSize: '0.75rem', color: '#f59e0b', borderColor: '#f59e0b40' }} />
      )}
      {stats.overdue > 0 && (
        <Chip label={`${stats.overdue} overdue`} size="small" variant="outlined" sx={{ fontSize: '0.75rem', color: '#ef4444', borderColor: '#ef444440' }} />
      )}
    </div>
  )
}
