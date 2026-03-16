'use client'

import { useState } from 'react'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import MuiButton from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CircleIcon from '@mui/icons-material/Circle'
import AddIcon from '@mui/icons-material/Add'
import { Label } from '@/types'
import { LABEL_COLORS } from '@/lib/constants'

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
      <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
        Labels
      </Typography>

      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {labels.map(label => (
            <Chip
              key={label.id}
              label={label.name}
              size="small"
              icon={<CircleIcon sx={{ fontSize: 8, color: `${label.color} !important` }} />}
              onClick={() => onToggle(label.id)}
              variant={selectedIds.includes(label.id) ? 'filled' : 'outlined'}
              sx={{
                bgcolor: selectedIds.includes(label.id) ? `${label.color}20` : 'transparent',
                color: label.color,
                borderColor: `${label.color}40`,
                fontWeight: 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                '&:hover': { bgcolor: `${label.color}15` },
              }}
            />
          ))}
        </div>
      )}

      {showCreate ? (
        <div className="flex items-end gap-2 mt-2">
          <TextField
            size="small"
            placeholder="Label name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCreate())}
            autoFocus
            sx={{ flex: 1 }}
          />
          <div className="flex gap-0.5">
            {LABEL_COLORS.slice(0, 6).map(color => (
              <IconButton
                key={color}
                size="small"
                onClick={() => setNewColor(color)}
                sx={{
                  width: 24,
                  height: 24,
                  border: newColor === color ? '2px solid' : '1px solid transparent',
                  borderColor: newColor === color ? 'text.secondary' : 'transparent',
                }}
              >
                <CircleIcon sx={{ fontSize: 14, color }} />
              </IconButton>
            ))}
          </div>
          <MuiButton
            size="small"
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !newName.trim()}
          >
            Add
          </MuiButton>
          <MuiButton
            size="small"
            variant="text"
            color="inherit"
            onClick={() => setShowCreate(false)}
          >
            Cancel
          </MuiButton>
        </div>
      ) : (
        <MuiButton
          size="small"
          variant="text"
          startIcon={<AddIcon />}
          onClick={() => setShowCreate(true)}
          sx={{ fontSize: '0.8rem' }}
        >
          Create label
        </MuiButton>
      )}
    </div>
  )
}
