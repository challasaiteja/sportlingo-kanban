'use client'

import { useState, useCallback, useRef } from 'react'
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Task, TaskStatus, TaskPriority, Label } from '@/types'
import { COLUMNS } from '@/lib/constants'
import { useTasks } from '@/hooks/useTasks'
import { useLabels, useTaskLabels } from '@/hooks/useLabels'
import { useFilters } from '@/hooks/useFilters'
import { Column } from './Column'
import { TaskCardOverlay } from './TaskCard'
import { TaskModal } from '@/components/tasks/TaskModal'
import { FilterBar } from '@/components/filters/FilterBar'
import { BoardStats } from '@/components/stats/BoardStats'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

interface BoardProps {
  userId: string
}

export function Board({ userId }: BoardProps) {
  const { tasks, loading, error, createTask, updateTask, deleteTask, moveTask, reorderTasks, refetch } = useTasks(userId)
  const { labels, createLabel } = useLabels(userId)
  const { addLabel, removeLabel } = useTaskLabels()
  const filters = useFilters()

  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [createStatus, setCreateStatus] = useState<TaskStatus | null>(null)
  const tasksSnapshot = useRef<Task[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  )

  const filteredTasks = filters.filterTasks(tasks)

  const getColumnTasks = useCallback(
    (status: TaskStatus) =>
      filteredTasks
        .filter(t => t.status === status)
        .sort((a, b) => a.position - b.position),
    [filteredTasks]
  )

  const findColumnByTaskId = (taskId: string): TaskStatus | null => {
    const task = tasks.find(t => t.id === taskId)
    return task?.status || null
  }

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id)
    if (task) {
      setActiveTask(task)
      tasksSnapshot.current = [...tasks]
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeStatus = findColumnByTaskId(activeId)
    let overStatus: TaskStatus | null = null

    // Check if we're over a column or a task
    if (over.data.current?.type === 'column') {
      overStatus = over.data.current.status as TaskStatus
    } else {
      overStatus = findColumnByTaskId(overId)
    }

    if (!activeStatus || !overStatus || activeStatus === overStatus) return

    // Move task to new column optimistically
    reorderTasks(
      tasks.map(t =>
        t.id === activeId ? { ...t, status: overStatus! } : t
      )
    )
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) {
      reorderTasks(tasksSnapshot.current)
      return
    }

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    let targetStatus: TaskStatus = activeTask.status
    let targetIndex = 0

    if (over.data.current?.type === 'column') {
      targetStatus = over.data.current.status as TaskStatus
      const columnTasks = tasks.filter(t => t.status === targetStatus && t.id !== activeId)
      targetIndex = columnTasks.length
    } else {
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        targetStatus = overTask.status
        const columnTasks = tasks
          .filter(t => t.status === targetStatus)
          .sort((a, b) => a.position - b.position)
        const overIndex = columnTasks.findIndex(t => t.id === overId)
        const activeIndex = columnTasks.findIndex(t => t.id === activeId)

        if (activeIndex !== -1 && activeIndex !== overIndex) {
          const reordered = arrayMove(columnTasks, activeIndex, overIndex)
          const updatedTasks = tasks.map(t => {
            const idx = reordered.findIndex(r => r.id === t.id)
            if (idx !== -1) return { ...t, position: idx, status: targetStatus }
            return t
          })
          await moveTask(activeId, targetStatus, overIndex, updatedTasks)
          return
        } else if (activeIndex === -1) {
          targetIndex = overIndex
        }
      }
    }

    // Cross-column move
    const updatedTasks = tasks.map(t => {
      if (t.id === activeId) return { ...t, status: targetStatus, position: targetIndex }
      return t
    })
    await moveTask(activeId, targetStatus, targetIndex, updatedTasks)
  }

  const handleLabelToggle = async (taskId: string, labelId: string, isAdding: boolean) => {
    if (isAdding) {
      await addLabel(taskId, labelId)
    } else {
      await removeLabel(taskId, labelId)
    }
    refetch()
  }

  const handleCreateTask = async (data: {
    title: string
    description: string
    priority: TaskPriority
    due_date: string | null
    status: TaskStatus
  }) => {
    await createTask(data)
  }

  const handleUpdateTask = async (data: {
    title: string
    description: string
    priority: TaskPriority
    due_date: string | null
    status: TaskStatus
  }) => {
    if (!editingTask) return
    await updateTask(editingTask.id, data)
  }

  const handleDeleteTask = async () => {
    if (!editingTask) return
    await deleteTask(editingTask.id)
    setEditingTask(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted">Loading your board...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <ErrorBanner message={error} onRetry={refetch} />
      </div>
    )
  }

  return (
    <>
      <BoardStats tasks={tasks} />
      <FilterBar
        labels={labels}
        {...filters}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4 px-4 snap-x snap-mandatory md:snap-none">
          {COLUMNS.map(column => (
            <div key={column.id} className="snap-center shrink-0 md:shrink">
              <Column
                column={column}
                tasks={getColumnTasks(column.id)}
                onTaskClick={setEditingTask}
                onAddTask={setCreateStatus}
              />
            </div>
          ))}
        </div>

        <DragOverlay>
          {activeTask && <TaskCardOverlay task={activeTask} />}
        </DragOverlay>
      </DndContext>

      {/* Create Task Modal */}
      {createStatus && (
        <TaskModal
          open={!!createStatus}
          onClose={() => setCreateStatus(null)}
          defaultStatus={createStatus}
          labels={labels}
          onSubmit={handleCreateTask}
          onLabelToggle={handleLabelToggle}
          onCreateLabel={createLabel}
        />
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          open={!!editingTask}
          onClose={() => setEditingTask(null)}
          task={editingTask}
          labels={labels}
          onSubmit={handleUpdateTask}
          onDelete={handleDeleteTask}
          onLabelToggle={handleLabelToggle}
          onCreateLabel={createLabel}
        />
      )}
    </>
  )
}
