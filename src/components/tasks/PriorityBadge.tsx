'use client'

import { TaskPriority } from '@/types'
import { PRIORITY_CONFIG } from '@/lib/constants'

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  if (priority === 'none') return null
  const config = PRIORITY_CONFIG[priority]

  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium"
      style={{ backgroundColor: config.bgColor, color: config.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: config.color }} />
      {config.label}
    </span>
  )
}
