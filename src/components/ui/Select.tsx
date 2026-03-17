'use client'

import { forwardRef } from 'react'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

interface SelectProps extends Omit<TextFieldProps, 'select'> {
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLInputElement, SelectProps>(
  ({ label, options, ...props }, ref) => {
    return (
      <TextField
        inputRef={ref}
        label={label}
        select
        fullWidth
        size="small"
        variant="outlined"
        {...props}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </TextField>
    )
  }
)

Select.displayName = 'Select'
