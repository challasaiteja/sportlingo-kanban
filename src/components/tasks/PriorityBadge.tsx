'use client'

import Chip from '@mui/material/Chip'
import CircleIcon from '@mui/icons-material/Circle'
import { TaskPriority } from '@/types'
import { PRIORITY_CONFIG } from '@/lib/constants'

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  if (priority === 'none') return null
  const config = PRIORITY_CONFIG[priority]

  return (
    <Chip
      size="small"
      icon={<CircleIcon sx={{ fontSize: 8, color: `${config.color} !important` }} />}
      label={config.label}
      sx={{
        bgcolor: config.bgColor,
        color: config.color,
        fontWeight: 500,
        fontSize: '0.7rem',
        height: 22,
        '& .MuiChip-icon': { ml: 0.5 },
      }}
    />
  )
}
