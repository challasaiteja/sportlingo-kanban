'use client'

import { useState } from 'react'
import MuiButton from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import DialogActions from '@mui/material/DialogActions'
import CircularProgress from '@mui/material/CircularProgress'
import DeleteIcon from '@mui/icons-material/Delete'
import { Task, TaskPriority, TaskStatus, Label } from '@/types'
import { PRIORITY_CONFIG } from '@/lib/constants'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
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
    <form onSubmit={handleSubmit} className="space-y-4 pt-1">
      <Input
        label="Title"
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => { setTitle(e.target.value); setTitleError('') }}
        error={titleError}
        autoFocus
      />

      <Textarea
        label="Description"
        placeholder="Add more details..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          options={priorityOptions}
        />
        <Select
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          options={statusOptions}
        />
      </div>

      <Input
        label="Due Date"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />

      <Divider sx={{ my: 1 }} />

      <LabelPicker
        labels={labels}
        selectedIds={selectedLabelIds}
        onToggle={onLabelToggle}
        onCreateLabel={onCreateLabel}
      />

      <DialogActions sx={{ px: 0, pt: 2 }}>
        {onDelete && (
          <MuiButton
            color="error"
            variant="outlined"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            sx={{ mr: 'auto' }}
          >
            Delete
          </MuiButton>
        )}
        <MuiButton
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {submitLabel}
        </MuiButton>
      </DialogActions>
    </form>
  )
}
