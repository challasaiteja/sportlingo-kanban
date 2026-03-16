'use client'

import { useState } from 'react'
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

  const isEdit = !!task

  const handleLabelToggle = async (labelId: string) => {
    const isSelected = selectedLabelIds.includes(labelId)
    if (isSelected) {
      setSelectedLabelIds(prev => prev.filter(id => id !== labelId))
    } else {
      setSelectedLabelIds(prev => [...prev, labelId])
    }
    if (task) {
      await onLabelToggle(task.id, labelId, !isSelected)
    }
  }

  const handleSubmit = async (data: {
    title: string
    description: string
    priority: TaskPriority
    due_date: string | null
    status: TaskStatus
  }) => {
    await onSubmit(data)
    // If creating a new task, handle labels after creation
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
