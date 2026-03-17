'use client'

import { useState } from 'react'
import TextField from '@mui/material/TextField'
import MuiButton from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import Badge from '@mui/material/Badge'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import CircleIcon from '@mui/icons-material/Circle'
import { TaskPriority, Label } from '@/types'
import { PRIORITY_CONFIG } from '@/lib/constants'
import { useMobile } from '@/hooks/useMobile'

interface FilterBarProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  priorityFilter: TaskPriority | 'all'
  setPriorityFilter: (p: TaskPriority | 'all') => void
  labelFilter: string[]
  setLabelFilter: (ids: string[]) => void
  hasActiveFilters: boolean
  clearFilters: () => void
  labels: Label[]
}

export function FilterBar({
  searchQuery,
  setSearchQuery,
  priorityFilter,
  setPriorityFilter,
  labelFilter,
  setLabelFilter,
  hasActiveFilters,
  clearFilters,
  labels,
}: FilterBarProps) {
  const { isMobile } = useMobile()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const filterOpen = Boolean(anchorEl)

  const priorities: TaskPriority[] = ['urgent', 'high', 'medium', 'low', 'none']
  const activeFilterCount =
    (priorityFilter !== 'all' ? 1 : 0) + labelFilter.length

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Search */}
      <TextField
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        sx={{ width: isMobile ? '100%' : 200, '& .MuiInputBase-root': { height: 34 } }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Filter Button */}
      <Badge
        badgeContent={activeFilterCount}
        color="primary"
        invisible={activeFilterCount === 0}
      >
        <MuiButton
          variant="outlined"
          size="small"
          startIcon={<FilterListIcon />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            color: 'text.secondary',
            borderColor: 'divider',
            '&:hover': { borderColor: 'text.secondary' },
          }}
        >
          Filter
        </MuiButton>
      </Badge>

      {/* Filter Popover */}
      <Popover
        open={filterOpen}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { width: 240, mt: 1, borderRadius: 2 } } }}
      >
        {/* Header with title + clear */}
        <div className="flex items-center justify-between p-3 pb-1">
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <MuiButton
              size="small"
              onClick={() => { clearFilters(); setAnchorEl(null) }}
              sx={{ fontSize: '0.75rem', textTransform: 'none', minWidth: 0, p: 0 }}
            >
              Clear
            </MuiButton>
          )}
        </div>
        <div className="px-3 pt-1">
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Priority
          </Typography>
        </div>
        <List dense disablePadding>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setPriorityFilter('all')}
              selected={priorityFilter === 'all'}
              sx={{ py: 0.5 }}
            >
              <ListItemText primary="All priorities" primaryTypographyProps={{ fontSize: '0.8rem' }} />
            </ListItemButton>
          </ListItem>
          {priorities.map(p => {
            const config = PRIORITY_CONFIG[p]
            return (
              <ListItem key={p} disablePadding>
                <ListItemButton
                  onClick={() => setPriorityFilter(priorityFilter === p ? 'all' : p)}
                  selected={priorityFilter === p}
                  sx={{ py: 0.5 }}
                >
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <CircleIcon sx={{ fontSize: 10, color: config.color }} />
                  </ListItemIcon>
                  <ListItemText primary={config.label} primaryTypographyProps={{ fontSize: '0.8rem' }} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        {labels.length > 0 && (
          <>
            <Divider sx={{ my: 1 }} />
            <div className="px-3 pb-1">
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Labels
              </Typography>
            </div>
            <List dense disablePadding>
              {labels.map(label => (
                <ListItem key={label.id} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (labelFilter.includes(label.id)) {
                        setLabelFilter(labelFilter.filter(id => id !== label.id))
                      } else {
                        setLabelFilter([...labelFilter, label.id])
                      }
                    }}
                    sx={{ py: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Checkbox
                        size="small"
                        checked={labelFilter.includes(label.id)}
                        tabIndex={-1}
                        disableRipple
                        sx={{ p: 0 }}
                      />
                    </ListItemIcon>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <CircleIcon sx={{ fontSize: 10, color: label.color }} />
                    </ListItemIcon>
                    <ListItemText primary={label.name} primaryTypographyProps={{ fontSize: '0.8rem' }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Popover>
    </div>
  )
}
