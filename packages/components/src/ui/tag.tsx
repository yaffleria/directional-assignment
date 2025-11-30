import React from 'react'
import { Badge } from './badge'
import { cn } from '@repo/utils'

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  variant?: 'default' | 'outline' | 'secondary'
}

export function Tag({ children, className, variant = 'default', ...props }: TagProps) {
  const variants = {
    default: 'bg-muted text-muted-foreground hover:bg-muted',
    outline: 'border-input bg-background hover:bg-accent',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
  }

  return (
    <Badge
      variant={variant === 'outline' ? 'outline' : 'secondary'}
      className={cn('rounded-full', variants[variant], className)}
      {...props}
    >
      #{children}
    </Badge>
  )
}
