'use client'

import { useState } from 'react'
import { Label } from '@/types'
import { LABEL_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface LabelPickerProps {
  labels: Label[]
  selectedIds: string[]
  onToggle: (labelId: string) => void
  onCreateLabel: (name: string, color: string) => Promise<Label>
}

export function LabelPicker({ labels, selectedIds, onToggle, onCreateLabel }: LabelPickerProps) {
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newColor, setNewColor] = useState(LABEL_COLORS[0])
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const label = await onCreateLabel(newName.trim(), newColor)
      onToggle(label.id)
      setNewName('')
      setShowCreate(false)
    } catch {
      // Label might already exist
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">Labels</label>

      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {labels.map(label => (
            <button
              key={label.id}
              type="button"
              onClick={() => onToggle(label.id)}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer border',
                selectedIds.includes(label.id)
                  ? 'ring-2 ring-offset-1'
                  : 'opacity-60 hover:opacity-100'
              )}
              style={{
                backgroundColor: `${label.color}18`,
                color: label.color,
                borderColor: `${label.color}30`,
                ...(selectedIds.includes(label.id) ? { ringColor: label.color } : {}),
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
              {label.name}
            </button>
          ))}
        </div>
      )}

      {showCreate ? (
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Label name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs rounded-md border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreate())}
              autoFocus
            />
          </div>
          <div className="flex gap-1">
            {LABEL_COLORS.slice(0, 6).map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setNewColor(color)}
                className={cn(
                  'w-5 h-5 rounded-full transition-transform cursor-pointer',
                  newColor === color && 'ring-2 ring-offset-1 ring-gray-400 scale-110'
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
            className="px-2.5 py-1.5 text-xs font-medium bg-accent text-white rounded-md hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowCreate(false)}
            className="px-2.5 py-1.5 text-xs text-muted hover:text-foreground cursor-pointer"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="text-xs text-accent hover:text-accent-hover font-medium cursor-pointer"
        >
          + Create label
        </button>
      )}
    </div>
  )
}
