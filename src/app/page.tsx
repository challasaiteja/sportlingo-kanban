'use client'

import { useAuth } from '@/hooks/useAuth'
import { Board } from '@/components/board/Board'
import { Spinner } from '@/components/ui/Spinner'
import { ErrorBanner } from '@/components/ui/ErrorBanner'

export default function Home() {
  const { user, loading, error } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">TaskFlow</p>
            <p className="text-xs text-muted mt-1">Setting up your workspace...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="max-w-md w-full px-4">
          <ErrorBanner
            message={error || 'Unable to initialize session.'}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-[1440px] mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">TaskFlow</h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            Guest Session
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="max-w-[1440px] mx-auto pt-4">
        <Board userId={user.id} />
      </main>
    </div>
  )
}
