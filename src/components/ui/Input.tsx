'use client'

import { forwardRef } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'

interface InputProps extends Omit<TextFieldProps, 'error'> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, label, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        label={label}
        error={!!error}
        helperText={error}
        fullWidth
        size="small"
        variant="outlined"
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
