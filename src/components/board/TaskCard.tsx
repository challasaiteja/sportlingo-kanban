'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
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
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        {/* Title row with checkbox */}
        <div className="flex items-start gap-2 mb-1.5">
          {isDone ? (
            <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981', mt: 0.2, flexShrink: 0 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: '#cbd5e1', mt: 0.2, flexShrink: 0 }} />
          )}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 600,
              lineHeight: 1.4,
              textDecoration: isDone ? 'line-through' : 'none',
              color: isDone ? 'text.secondary' : 'text.primary',
            }}
          >
            {task.title}
          </Typography>
        </div>

        {/* Labels */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-1 ml-6.5 mb-2">
            {labels.map(label => (
              <LabelBadge key={label.id} name={label.name} color={label.color} />
            ))}
          </div>
        )}

        {/* Bottom row: priority, avatar, due date */}
        <div className="flex items-center justify-between ml-6.5">
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="flex items-center gap-2">
            <DueDateBadge dueDate={task.due_date} />
            <Avatar
              sx={{
                width: 22,
                height: 22,
                fontSize: '0.65rem',
                bgcolor: '#e2e8f0',
                color: '#64748b',
              }}
            >
              G
            </Avatar>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return <TaskCard task={task} onClick={() => {}} isDragOverlay />
}
