'use client'

import Alert from '@mui/material/Alert'
import MuiButton from '@mui/material/Button'

interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <Alert
      severity="error"
      action={
        onRetry && (
          <MuiButton color="inherit" size="small" onClick={onRetry}>
            Retry
          </MuiButton>
        )
      }
    >
      {message}
    </Alert>
  )
}
