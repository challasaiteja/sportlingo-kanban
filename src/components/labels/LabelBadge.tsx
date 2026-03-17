'use client'

import Chip from '@mui/material/Chip'
import CloseIcon from '@mui/icons-material/Close'

interface LabelBadgeProps {
  name: string
  color: string
  onRemove?: () => void
  size?: 'sm' | 'md'
}

export function LabelBadge({ name, color, onRemove, size = 'sm' }: LabelBadgeProps) {
  return (
    <Chip
      label={name}
      size="small"
      onDelete={onRemove}
      deleteIcon={onRemove ? <CloseIcon sx={{ fontSize: 12 }} /> : undefined}
      sx={{
        bgcolor: `${color}18`,
        color,
        border: `1px solid ${color}30`,
        fontWeight: 500,
        fontSize: size === 'sm' ? '0.65rem' : '0.75rem',
        height: size === 'sm' ? 20 : 24,
        '& .MuiChip-deleteIcon': {
          color,
          '&:hover': { color },
        },
      }}
    />
  )
}
