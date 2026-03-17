'use client'

import { useState, useRef, useEffect } from 'react'
import { Task, TaskStatus, TaskPriority, Label } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from './TaskForm'

interface TaskModalProps {
  open: boolean
  onClose: () => void
  task?: Task
  defaultStatus?: TaskStatus
  labels: Label[]
  onSubmit: (data: {
    title: string
    description: string
    priority: TaskPriority
    due_date: string | null
    status: TaskStatus
  }) => Promise<void>
  onDelete?: () => void
  onLabelToggle: (taskId: string, labelId: string, isAdding: boolean) => Promise<void>
  onCreateLabel: (name: string, color: string) => Promise<Label>
}

export function TaskModal({
  open,
  onClose,
  task,
  defaultStatus,
  labels,
  onSubmit,
  onDelete,
  onLabelToggle,
  onCreateLabel,
}: TaskModalProps) {
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    task?.task_labels?.map(tl => tl.label_id) || []
  )
  const initialLabelIds = useRef<string[]>(
    task?.task_labels?.map(tl => tl.label_id) || []
  )

  useEffect(() => {
    const ids = task?.task_labels?.map(tl => tl.label_id) || []
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync derived state from task prop
    setSelectedLabelIds(ids)
    initialLabelIds.current = ids
  }, [task])

  const isEdit = !!task

  // Only toggle locally — don't call Supabase yet
  const handleLabelToggle = (labelId: string) => {
    setSelectedLabelIds(prev =>
      prev.includes(labelId)
        ? prev.filter(id => id !== labelId)
        : [...prev, labelId]
    )
  }

  const handleSubmit = async (data: {
    title: string
    description: string
    priority: TaskPriority
    due_date: string | null
    status: TaskStatus
  }) => {
    await onSubmit(data)

    // Now persist label changes by diffing against initial state
    if (task) {
      const added = selectedLabelIds.filter(id => !initialLabelIds.current.includes(id))
      const removed = initialLabelIds.current.filter(id => !selectedLabelIds.includes(id))

      await Promise.all([
        ...added.map(id => onLabelToggle(task.id, id, true)),
        ...removed.map(id => onLabelToggle(task.id, id, false)),
      ])
    }

    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Task' : 'New Task'}
    >
      <TaskForm
        initialData={task}
        defaultStatus={defaultStatus}
        labels={labels}
        selectedLabelIds={selectedLabelIds}
        onLabelToggle={handleLabelToggle}
        onCreateLabel={onCreateLabel}
        onSubmit={handleSubmit}
        onDelete={onDelete}
        submitLabel={isEdit ? 'Save Changes' : 'Create Task'}
      />
    </Modal>
  )
}
