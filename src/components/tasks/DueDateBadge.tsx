'use client'

import Typography from '@mui/material/Typography'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { getDueDateUrgency, formatDueDate } from '@/lib/utils'

const urgencyColors = {
  overdue: '#ef4444',
  'due-soon': '#f59e0b',
  upcoming: '#eab308',
  normal: '#64748b',
}

export function DueDateBadge({ dueDate }: { dueDate: string | null }) {
  const urgency = getDueDateUrgency(dueDate)
  if (!urgency) return null

  const formatted = formatDueDate(dueDate)
  const color = urgencyColors[urgency]

  return (
    <Typography
      variant="caption"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        color,
        fontWeight: urgency === 'overdue' ? 600 : 400,
        fontSize: '0.7rem',
      }}
    >
      <CalendarTodayIcon sx={{ fontSize: 12 }} />
      {formatted}
    </Typography>
  )
}
