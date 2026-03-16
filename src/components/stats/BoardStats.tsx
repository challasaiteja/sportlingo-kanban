'use client'

import { useMemo } from 'react'
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
    <div className="px-4 pb-3">
      <div className="flex items-center gap-4 text-xs">
        <StatItem label="Total" value={stats.total} color="text-foreground" />
        <StatItem label="In Progress" value={stats.inProgress} color="text-amber-600" />
        <StatItem label="Completed" value={stats.completed} color="text-emerald-600" />
        {stats.overdue > 0 && (
          <StatItem label="Overdue" value={stats.overdue} color="text-red-500" />
        )}
      </div>
    </div>
  )
}

function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted">{label}</span>
      <span className={`font-semibold ${color}`}>{value}</span>
    </div>
  )
}
