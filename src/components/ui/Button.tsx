'use client'

import { forwardRef } from 'react'
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  variant?: Variant
  size?: Size
  loading?: boolean
}

const variantMap: Record<Variant, { muiVariant: MuiButtonProps['variant']; color: MuiButtonProps['color'] }> = {
  primary: { muiVariant: 'contained', color: 'primary' },
  secondary: { muiVariant: 'outlined', color: 'inherit' },
  ghost: { muiVariant: 'text', color: 'inherit' },
  danger: { muiVariant: 'contained', color: 'error' },
}

const sizeMap: Record<Size, MuiButtonProps['size']> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const { muiVariant, color } = variantMap[variant]

    return (
      <MuiButton
        ref={ref}
        variant={muiVariant}
        color={color}
        size={sizeMap[size]}
        disabled={disabled || loading}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        {...props}
      >
        {children}
      </MuiButton>
    )
  }
)

Button.displayName = 'Button'
