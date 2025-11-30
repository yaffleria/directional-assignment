import type { Category } from "../../api/data-contracts";

export function CategoryBadge({ category }: { category: Category }) {
  const colorClasses = {
    NOTICE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    QNA: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    FREE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${colorClasses[category]}`}
    >
      {category}
    </span>
  );
}
