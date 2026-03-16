'use client'

import { useState } from 'react'
import { Task, TaskPriority, TaskStatus, Label } from '@/types'
import { PRIORITY_CONFIG } from '@/lib/constants'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { LabelPicker } from '@/components/labels/LabelPicker'

interface TaskFormProps {
  initialData?: Task
  defaultStatus?: TaskStatus
  labels: Label[]
  selectedLabelIds: string[]
  onLabelToggle: (labelId: string) => void
  onCreateLabel: (name: string, color: string) => Promise<Label>
  onSubmit: (data: {
    title: string
    description: string
    priority: TaskPriority
    due_date: string | null
    status: TaskStatus
  }) => Promise<void>
  onDelete?: () => void
  submitLabel: string
}

export function TaskForm({
  initialData,
  defaultStatus = 'todo',
  labels,
  selectedLabelIds,
  onLabelToggle,
  onCreateLabel,
  onSubmit,
  onDelete,
  submitLabel,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [priority, setPriority] = useState<TaskPriority>(initialData?.priority || 'none')
  const [dueDate, setDueDate] = useState(initialData?.due_date || '')
  const [status, setStatus] = useState<TaskStatus>(initialData?.status || defaultStatus)
  const [loading, setLoading] = useState(false)
  const [titleError, setTitleError] = useState('')

  const priorityOptions = Object.entries(PRIORITY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label,
  }))

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'in_review', label: 'In Review' },
    { value: 'done', label: 'Done' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Title is required')
      return
    }
    setTitleError('')
    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        due_date: dueDate || null,
        status,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="title"
        label="Title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setTitleError('') }}
        error={titleError}
        autoFocus
      />

      <Textarea
        id="description"
        label="Description"
        placeholder="Add more details..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          id="priority"
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          options={priorityOptions}
        />
        <Select
          id="status"
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          options={statusOptions}
        />
      </div>

      <Input
        id="due_date"
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <LabelPicker
        labels={labels}
        selectedIds={selectedLabelIds}
        onToggle={onLabelToggle}
        onCreateLabel={onCreateLabel}
      />

      <div className="flex items-center justify-between pt-2">
        <div>
          {onDelete && (
            <Button type="button" variant="danger" size="sm" onClick={onDelete}>
              Delete Task
            </Button>
          )}
        </div>
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
