import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { helperText?: string; inputProps?: React.ComponentProps<"input">; error?: boolean }
>(({ className, helperText, inputProps, error, ...props }, ref) => {
  return (
    <div className={cn("flex flex-col space-y-1", className)} ref={ref} {...props}>
      <Input
        {...inputProps}
        className={cn(inputProps?.className, error ? "border-red-500" : "")}
      />
      {helperText && (
        <span className={cn("text-xs", error ? "text-red-500" : "text-muted-foreground")}>
          {helperText}
        </span>
      )}
    </div>
  )
})
InputGroup.displayName = "InputGroup"

export { InputGroup }

export { Input }
