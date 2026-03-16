'use client'

import { getDueDateUrgency, formatDueDate } from '@/lib/utils'

const urgencyStyles = {
  overdue: 'bg-red-50 text-red-600 border-red-200',
  'due-soon': 'bg-amber-50 text-amber-600 border-amber-200',
  upcoming: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  normal: 'bg-gray-50 text-gray-500 border-gray-200',
}

export function DueDateBadge({ dueDate }: { dueDate: string | null }) {
  const urgency = getDueDateUrgency(dueDate)
  if (!urgency) return null

  const formatted = formatDueDate(dueDate)

  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium border ${urgencyStyles[urgency]}`}>
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
      {formatted}
    </span>
  )
}
