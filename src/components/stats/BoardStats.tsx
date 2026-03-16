'use client'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import AssignmentIcon from '@mui/icons-material/Assignment'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import AutorenewIcon from '@mui/icons-material/Autorenew'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Task } from '@/types'
import { getDueDateUrgency } from '@/lib/utils'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  bgColor: string
  iconColor: string
}

function StatCard({ icon, label, value, bgColor, iconColor }: StatCardProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        bgcolor: bgColor,
        borderRadius: 2.5,
        px: 2,
        py: 1.25,
        minWidth: 140,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2,
          bgcolor: `${iconColor}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: iconColor,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
          {value}
        </Typography>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>
          {label}
        </Typography>
      </Box>
    </Stack>
  )
}

interface BoardStatsProps {
  tasks: Task[]
}

export function BoardStats({ tasks }: BoardStatsProps) {
  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'done').length
    const active = tasks.filter(t => t.status !== 'done').length
    const overdue = tasks.filter(t =>
      t.status !== 'done' && getDueDateUrgency(t.due_date) === 'overdue'
    ).length

    return { total, completed, active, overdue }
  }, [tasks])

  if (stats.total === 0) return null

  return (
    <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
      <StatCard
        icon={<AssignmentIcon sx={{ fontSize: 20 }} />}
        label="Total Tasks"
        value={stats.total}
        bgColor="#f0f4ff"
        iconColor="#6366f1"
      />
      <StatCard
        icon={<CheckCircleOutlineIcon sx={{ fontSize: 20 }} />}
        label="Completed"
        value={stats.completed}
        bgColor="#ecfdf5"
        iconColor="#10b981"
      />
      <StatCard
        icon={<AutorenewIcon sx={{ fontSize: 20 }} />}
        label="Active"
        value={stats.active}
        bgColor="#fffbeb"
        iconColor="#f59e0b"
      />
      {stats.overdue > 0 && (
        <StatCard
          icon={<WarningAmberIcon sx={{ fontSize: 20 }} />}
          label="Overdue"
          value={stats.overdue}
          bgColor="#fef2f2"
          iconColor="#ef4444"
        />
      )}
    </Stack>
  )
}
