import * as React from "react"
import { cn } from "@/utils/utils"

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md bg-blue-100 dark:bg-blue-900 px-2 py-1 text-xs font-medium text-blue-800 dark:text-blue-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tag } 