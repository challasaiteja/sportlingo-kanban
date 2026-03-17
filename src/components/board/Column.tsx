'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import MuiButton from '@mui/material/Button'
import CircleIcon from '@mui/icons-material/Circle'
import AddIcon from '@mui/icons-material/Add'
import { Task, TaskStatus } from '@/types'
import { ColumnDef } from '@/lib/constants'
import { TaskCard } from './TaskCard'

interface ColumnProps {
  column: ColumnDef
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onAddTask: (status: TaskStatus) => void
}

export function Column({ column, tasks, onTaskClick, onAddTask }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', status: column.id },
  })

  const taskIds = tasks.map(t => t.id)

  return (
    <div className="flex flex-col min-w-[260px] md:min-w-[300px] md:max-w-[340px] w-full">
      {/* Column Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <div className="flex items-center gap-2">
          <CircleIcon sx={{ fontSize: 14, color: column.color }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {column.title}
          </Typography>
          <Chip
            label={tasks.length}
            size="small"
            sx={{
              height: 20,
              fontSize: '0.7rem',
              fontWeight: 600,
              bgcolor: '#f1f5f9',
              color: '#64748b',
            }}
          />
        </div>
        <IconButton
          size="small"
          onClick={() => onAddTask(column.id)}
          sx={{ color: 'text.secondary' }}
        >
          <AddIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Task List */}
      <div
        ref={setNodeRef}
        style={{
          backgroundColor: isOver ? 'rgba(99, 102, 241, 0.04)' : '#f4f5f7',
          outline: isOver ? '2px solid rgba(99, 102, 241, 0.2)' : 'none',
          outlineOffset: '-2px',
          borderRadius: 10,
          padding: 6,
          minHeight: tasks.length === 0 ? 80 : undefined,
          transition: 'background-color 0.2s, outline 0.2s',
        }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task)}
              columnColor={column.color}
            />
          ))}
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-4 px-3">
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {column.emptyMessage}
            </Typography>
          </div>
        )}
      </div>

      {/* Add Task Button at bottom */}
      <MuiButton
        variant="text"
        startIcon={<AddIcon />}
        onClick={() => onAddTask(column.id)}
        sx={{
          justifyContent: 'flex-start',
          color: 'text.secondary',
          mt: 1,
          mx: 1,
          fontSize: '0.8rem',
          fontWeight: 500,
          '&:hover': { bgcolor: '#f1f5f9' },
        }}
      >
        Add task
      </MuiButton>
    </div>
  )
}
