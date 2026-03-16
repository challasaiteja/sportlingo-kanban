'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Task } from '@/types'
import { PriorityBadge } from '@/components/tasks/PriorityBadge'
import { DueDateBadge } from '@/components/tasks/DueDateBadge'
import { LabelBadge } from '@/components/labels/LabelBadge'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onClick: () => void
  isDragOverlay?: boolean
}

export function TaskCard({ task, onClick, isDragOverlay }: TaskCardProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'group bg-surface rounded-lg border border-border p-3 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md hover:border-border-hover',
        isDragging && 'opacity-40 shadow-none',
        isDragOverlay && 'drag-overlay',
      )}
    >
      {/* Labels */}
      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {labels.map(label => (
            <LabelBadge key={label.id} name={label.name} color={label.color} />
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-foreground leading-snug mb-2">
        {task.title}
      </p>

      {/* Description preview */}
      {task.description && (
        <p className="text-xs text-muted line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      {/* Bottom row: priority + due date */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <PriorityBadge priority={task.priority} />
        <DueDateBadge dueDate={task.due_date} />
      </div>
    </div>
  )
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return <TaskCard task={task} onClick={() => {}} isDragOverlay />
}
