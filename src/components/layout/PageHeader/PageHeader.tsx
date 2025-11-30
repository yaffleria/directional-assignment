import { cn } from "../../../lib/utils";

import type { PageHeaderProps } from "./PageHeader.types";

export function PageHeader({ children, className, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn("border-b bg-card sticky top-0 z-10 shadow-sm", className)}
      {...props}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {children}
      </div>
    </header>
  );
}
