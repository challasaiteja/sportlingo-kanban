'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Label } from '@/types'

export function useLabels(userId: string | undefined) {
  const [labels, setLabels] = useState<Label[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLabels = useCallback(async () => {
    if (!userId) return
    const { data, error } = await supabase
      .from('labels')
      .select('id, name, color')
      .order('name')

    if (error) {
      console.error('Failed to fetch labels:', error)
    } else {
      setLabels(data || [])
    }
    setLoading(false)
  }, [userId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load via reusable callback
    fetchLabels()
  }, [fetchLabels])

  const createLabel = useCallback(async (name: string, color: string) => {
    const { data, error } = await supabase
      .from('labels')
      .insert({ name, color })
      .select('id, name, color')
      .single()

    if (error) throw error
    setLabels(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    return data
  }, [])

  const deleteLabel = useCallback(async (id: string) => {
    const { error } = await supabase.from('labels').delete().eq('id', id)
    if (error) throw error
    setLabels(prev => prev.filter(l => l.id !== id))
  }, [])

  return { labels, loading, createLabel, deleteLabel, refetch: fetchLabels }
}

export function useTaskLabels() {
  const addLabel = useCallback(async (taskId: string, labelId: string) => {
    const { error } = await supabase
      .from('task_labels')
      .insert({ task_id: taskId, label_id: labelId })
    if (error) throw error
  }, [])

  const removeLabel = useCallback(async (taskId: string, labelId: string) => {
    const { error } = await supabase
      .from('task_labels')
      .delete()
      .eq('task_id', taskId)
      .eq('label_id', labelId)
    if (error) throw error
  }, [])

  return { addLabel, removeLabel }
}
