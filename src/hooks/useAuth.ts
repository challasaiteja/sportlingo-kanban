'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          setLoading(false)
          return
        }

        const { data, error: signInError } = await supabase.auth.signInAnonymously()
        if (signInError) {
          setError('Failed to initialize session. Please refresh the page.')
          console.error('Auth error:', signInError)
        } else {
          setUser(data.user)
        }
      } catch {
        setError('Failed to connect. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading, error }
}
