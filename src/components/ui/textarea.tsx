import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea"> & {
    helperText?: string;
    inputProps?: React.ComponentProps<"textarea">;
    error?: boolean;
    preview?: React.ReactNode;
  }
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

const TextareaGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    helperText?: string;
    inputProps?: React.ComponentProps<"textarea">;
    error?: boolean;
    preview?: React.ReactNode;
  }
>(({ className, helperText, inputProps, error, preview, ...props }, ref) => {
  return (
    <div
      className={cn("flex flex-col space-y-1", className)}
      ref={ref}
      {...props}
    >
      <Textarea
        {...inputProps}
        className={cn(inputProps?.className, error ? "border-red-500" : "")}
      />
      {helperText && (
        <span
          className={cn(
            "text-xs",
            error ? "text-red-500" : "text-muted-foreground"
          )}
        >
          {helperText}
        </span>
      )}
      {preview && <div className="mt-2">{preview}</div>}
    </div>
  );
});

export { Textarea, TextareaGroup };
