import { Badge } from './badge'
import { cn, Category } from '@repo/utils'

export interface CategoryBadgeProps {
  category: Category
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClasses: Record<Category, string> = {
    [Category.NOTICE]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    [Category.QNA]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
    [Category.FREE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200'
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
