'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Task } from '@/types'
import { PriorityBadge } from '@/components/tasks/PriorityBadge'
import { DueDateBadge } from '@/components/tasks/DueDateBadge'
import { LabelBadge } from '@/components/labels/LabelBadge'

interface TaskCardProps {
  task: Task
  onClick: () => void
  columnColor?: string
  isDragOverlay?: boolean
}

export function TaskCard({ task, onClick, columnColor = '#6366f1', isDragOverlay }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const labels = task.task_labels?.map(tl => tl.labels).filter(Boolean) || []
  const isDone = task.status === 'done'
  const hasBottom = task.priority !== 'none' || task.due_date

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={isDragOverlay ? 'drag-overlay' : ''}
      sx={{
        borderLeft: `3px solid ${columnColor}`,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.4 : 1,
        transition: 'box-shadow 0.2s, opacity 0.2s',
        '&:hover': {
          boxShadow: isDragging ? 'none' : '0 2px 8px rgba(0,0,0,0.08)',
        },
        mb: 1,
      }}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        {/* Title row with checkbox */}
        <Stack direction="row" spacing={1} alignItems="flex-start">
          <Box sx={{ pt: 0.2, flexShrink: 0 }}>
            {isDone ? (
              <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} />
            ) : (
              <RadioButtonUncheckedIcon sx={{ fontSize: 16, color: '#cbd5e1' }} />
            )}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: '0.82rem',
                lineHeight: 1.4,
                textDecoration: isDone ? 'line-through' : 'none',
                color: isDone ? 'text.secondary' : 'text.primary',
              }}
            >
              {task.title}
            </Typography>

            {/* Labels */}
            {labels.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ mt: 0.75, flexWrap: 'wrap', gap: 0.5 }}>
                {labels.map(label => (
                  <LabelBadge key={label.id} name={label.name} color={label.color} />
                ))}
              </Stack>
            )}

            {/* Bottom row: priority + due date + avatar */}
            {(hasBottom || true) && (
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.75 }}>
                <Box>
                  <PriorityBadge priority={task.priority} />
                </Box>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <DueDateBadge dueDate={task.due_date} />
                  <Avatar
                    sx={{
                      width: 20,
                      height: 20,
                      fontSize: '0.6rem',
                      bgcolor: '#e2e8f0',
                      color: '#64748b',
                    }}
                  >
                    G
                  </Avatar>
                </Stack>
              </Stack>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return <TaskCard task={task} onClick={() => {}} isDragOverlay />
}
