'use client'

import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-foreground placeholder:text-muted transition-colors resize-none',
            'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent hover:border-border-hover',
            className
          )}
          rows={3}
          {...props}
        />
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
