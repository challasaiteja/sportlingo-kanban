'use client'

import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
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
            <Typography variant="subtitle1" fontWeight={600}>TaskFlow</Typography>
            <Typography variant="caption" color="text.secondary">
              Setting up your workspace...
            </Typography>
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
    <div className="min-h-screen" style={{ backgroundColor: '#fafafa' }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ maxWidth: 1440, mx: 'auto', width: '100%', px: { xs: 2, md: 3 } }}>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              bgcolor: 'primary.main',
              mr: 1.5,
              borderRadius: 1.5,
            }}
          >
            <DashboardIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', flexGrow: 1 }}>
            TaskFlow
          </Typography>
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: '#10b981 !important', width: 8, height: 8 }}> </Avatar>
            }
            label="Guest Session"
            size="small"
            variant="outlined"
            sx={{ fontSize: '0.75rem', borderColor: 'divider' }}
          />
        </Toolbar>
      </AppBar>

      <main className="max-w-[1440px] mx-auto pt-5">
        <Board userId={user.id} />
      </main>
    </div>
  )
}
