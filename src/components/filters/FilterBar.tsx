'use client'

import { TaskPriority, Label } from '@/types'
import { PRIORITY_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

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
  const priorities: (TaskPriority | 'all')[] = ['all', 'urgent', 'high', 'medium', 'low', 'none']

  return (
    <div className="px-4 pb-4 space-y-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent w-56"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-foreground cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1">
          {priorities.map(p => {
            const config = p === 'all' ? null : PRIORITY_CONFIG[p]
            return (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer',
                  priorityFilter === p
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-foreground hover:bg-column-bg'
                )}
              >
                {p === 'all' ? 'All' : config?.label}
              </button>
            )
          })}
        </div>

        {/* Label Filter */}
        {labels.length > 0 && (
          <div className="flex items-center gap-1">
            {labels.map(label => (
              <button
                key={label.id}
                onClick={() => {
                  if (labelFilter.includes(label.id)) {
                    setLabelFilter(labelFilter.filter(id => id !== label.id))
                  } else {
                    setLabelFilter([...labelFilter, label.id])
                  }
                }}
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-md transition-all cursor-pointer border',
                  labelFilter.includes(label.id)
                    ? 'ring-1 ring-offset-1'
                    : 'opacity-60 hover:opacity-100'
                )}
                style={{
                  backgroundColor: `${label.color}15`,
                  color: label.color,
                  borderColor: `${label.color}30`,
                }}
              >
                {label.name}
              </button>
            ))}
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-xs text-accent hover:text-accent-hover font-medium cursor-pointer"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
