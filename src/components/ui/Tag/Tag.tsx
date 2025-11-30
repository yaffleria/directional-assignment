import React from "react";
import { cn } from "../../../lib/utils";

import type { TagProps } from "./Tag.types";

export function Tag({
  children,
  className,
  variant = "default",
  ...props
}: TagProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    outline: "border border-input bg-background",
    secondary: "bg-secondary text-secondary-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    >
      #{children}
    </span>
  );
}
