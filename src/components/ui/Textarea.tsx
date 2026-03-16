'use client'

import { forwardRef } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

export const Textarea = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        label={label}
        fullWidth
        multiline
        rows={3}
        size="small"
        variant="outlined"
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'
