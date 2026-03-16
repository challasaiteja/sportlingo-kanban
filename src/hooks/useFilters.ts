'use client'

import { useState, useCallback, useMemo } from 'react'
import { Task, TaskPriority } from '@/types'

export function useFilters() {
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all')
  const [labelFilter, setLabelFilter] = useState<string[]>([])

  const filterTasks = useCallback((tasks: Task[]) => {
    return tasks.filter(task => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesTitle = task.title.toLowerCase().includes(query)
        const matchesDesc = task.description?.toLowerCase().includes(query)
        if (!matchesTitle && !matchesDesc) return false
      }

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) {
        return false
      }

      // Label filter
      if (labelFilter.length > 0) {
        const taskLabelIds = task.task_labels?.map(tl => tl.label_id) || []
        if (!labelFilter.some(id => taskLabelIds.includes(id))) {
          return false
        }
      }

      return true
    })
  }, [searchQuery, priorityFilter, labelFilter])

  const hasActiveFilters = useMemo(() => {
    return searchQuery !== '' || priorityFilter !== 'all' || labelFilter.length > 0
  }, [searchQuery, priorityFilter, labelFilter])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setPriorityFilter('all')
    setLabelFilter([])
  }, [])

  return {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    labelFilter,
    setLabelFilter,
    filterTasks,
    hasActiveFilters,
    clearFilters,
  }
}
