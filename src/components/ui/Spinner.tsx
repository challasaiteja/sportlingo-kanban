'use client'

import CircularProgress from '@mui/material/CircularProgress'

const sizes = { sm: 16, md: 32, lg: 48 }

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <CircularProgress size={sizes[size]} />
}
