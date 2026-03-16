'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Task, TaskStatus, TaskPriority } from '@/types'

interface CreateTaskData {
  title: string
  description?: string
  status: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
}

interface UpdateTaskData {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string | null
  position?: number
}

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tasksRef = useRef<Task[]>([])

  // Keep ref in sync for stable snapshots in callbacks
  tasksRef.current = tasks

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*, task_labels(label_id, labels(id, name, color))')
        .order('position', { ascending: true })
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setTasks(data || [])
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
      setError('Failed to load tasks.')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Optimistic update helper: snapshot → apply → rollback on error
  const optimistic = useCallback(
    async (apply: (prev: Task[]) => Task[], mutation: () => Promise<void>) => {
      const snapshot = tasksRef.current
      setTasks(apply(snapshot))
      try {
        await mutation()
      } catch (err) {
        setTasks(snapshot)
        throw err
      }
    },
    []
  )

  const createTask = useCallback(async (data: CreateTaskData) => {
    if (!userId) return

    const tasksInColumn = tasksRef.current.filter(t => t.status === data.status)
    const maxPosition = tasksInColumn.length > 0
      ? Math.max(...tasksInColumn.map(t => t.position))
      : -1

    const { data: newTask, error: createError } = await supabase
      .from('tasks')
      .insert({
        title: data.title,
        description: data.description || '',
        status: data.status,
        priority: data.priority || 'none',
        due_date: data.due_date || null,
        position: maxPosition + 1,
      })
      .select()
      .single()

    if (createError) {
      console.error('Failed to create task:', createError)
      throw new Error('Failed to create task')
    }

    setTasks(prev => [...prev, { ...newTask, task_labels: [] }])
    return newTask
  }, [userId])

  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    await optimistic(
      prev => prev.map(t => t.id === id ? { ...t, ...data } : t),
      async () => {
        const { error } = await supabase.from('tasks').update(data).eq('id', id)
        if (error) {
          console.error('Failed to update task:', error)
          throw new Error('Failed to update task')
        }
      }
    )
  }, [optimistic])

  const deleteTask = useCallback(async (id: string) => {
    await optimistic(
      prev => prev.filter(t => t.id !== id),
      async () => {
        const { error } = await supabase.from('tasks').delete().eq('id', id)
        if (error) {
          console.error('Failed to delete task:', error)
          throw new Error('Failed to delete task')
        }
      }
    )
  }, [optimistic])

  const moveTask = useCallback(async (
    taskId: string,
    newStatus: TaskStatus,
    newPosition: number,
    updatedTasks: Task[]
  ) => {
    await optimistic(
      () => updatedTasks,
      async () => {
        const { error: moveError } = await supabase
          .from('tasks')
          .update({ status: newStatus, position: newPosition })
          .eq('id', taskId)

        if (moveError) throw moveError

        // Reorder affected columns
        const snapshot = tasksRef.current
        const affectedStatuses = new Set([newStatus])
        const movedTask = snapshot.find(t => t.id === taskId)
        if (movedTask && movedTask.status !== newStatus) {
          affectedStatuses.add(movedTask.status)
        }

        for (const status of affectedStatuses) {
          const columnTasks = updatedTasks
            .filter(t => t.status === status && t.id !== taskId)
            .sort((a, b) => a.position - b.position)

          const updates = columnTasks
            .map((t, i) => ({ id: t.id, position: i }))
            .filter((u, i) => columnTasks[i]?.position !== u.position)

          if (updates.length > 0) {
            const { error: reorderError } = await supabase
              .from('tasks')
              .upsert(updates, { onConflict: 'id' })
            if (reorderError) throw reorderError
          }
        }
      }
    )
  }, [optimistic])

  const reorderTasks = useCallback((updatedTasks: Task[]) => {
    setTasks(updatedTasks)
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    refetch: fetchTasks,
  }
}
