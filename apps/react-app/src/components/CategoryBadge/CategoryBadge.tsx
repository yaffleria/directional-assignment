import { Badge } from '@repo/components'
import { cn } from '@repo/utils'
import type { Category } from '../../api/data-contracts'
import type { CategoryBadgeProps } from './CategoryBadge.types'

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClasses: Record<Category, string> = {
    NOTICE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    QNA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
    FREE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200'
  }

  return (
    <Badge
      variant="outline"
      className={cn(colorClasses[category])}
    >
      {category}
    </Badge>
  )
}
