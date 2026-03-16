'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const fetchTasks = useCallback(async () => {
    if (!userId) return
    try {
      setError(null)
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*, task_labels(label_id, labels(*))')
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

  const createTask = useCallback(async (data: CreateTaskData) => {
    if (!userId) return

    const tasksInColumn = tasks.filter(t => t.status === data.status)
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
      .select('*, task_labels(label_id, labels(*))')
      .single()

    if (createError) {
      console.error('Failed to create task:', createError)
      throw new Error('Failed to create task')
    }

    setTasks(prev => [...prev, newTask])
    return newTask
  }, [userId, tasks])

  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    const snapshot = tasks
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))

    const { error: updateError } = await supabase
      .from('tasks')
      .update(data)
      .eq('id', id)

    if (updateError) {
      console.error('Failed to update task:', updateError)
      setTasks(snapshot)
      throw new Error('Failed to update task')
    }
  }, [tasks])

  const deleteTask = useCallback(async (id: string) => {
    const snapshot = tasks
    setTasks(prev => prev.filter(t => t.id !== id))

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Failed to delete task:', deleteError)
      setTasks(snapshot)
      throw new Error('Failed to delete task')
    }
  }, [tasks])

  const moveTask = useCallback(async (
    taskId: string,
    newStatus: TaskStatus,
    newPosition: number,
    updatedTasks: Task[]
  ) => {
    const snapshot = tasks
    setTasks(updatedTasks)

    try {
      // Update the moved task's status and position
      const { error: moveError } = await supabase
        .from('tasks')
        .update({ status: newStatus, position: newPosition })
        .eq('id', taskId)

      if (moveError) throw moveError

      // Reorder all tasks in affected columns
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
          .map((t, i) => ({ id: t.id, position: t.id === taskId ? newPosition : i }))
          .filter((u, i) => columnTasks[i]?.position !== u.position)

        await Promise.all(
          updates.map(u =>
            supabase.from('tasks').update({ position: u.position }).eq('id', u.id)
          )
        )
      }
    } catch (err) {
      console.error('Failed to move task:', err)
      setTasks(snapshot)
    }
  }, [tasks])

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
