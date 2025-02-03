import * as React from "react";

import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

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
    );
  }
);
Input.displayName = "Input";

const InputGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    helperText?: string;
    inputProps?: React.ComponentProps<"input">;
    error?: boolean;
  }
>(({ className, helperText, inputProps, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div
      className={cn("flex flex-col space-y-1", className)}
      ref={ref}
      {...props}
    >
      <div className="relative">
        <Input
          {...inputProps}
          type={
            inputProps?.type === "password" && showPassword
              ? "text"
              : inputProps?.type
          }
          className={cn(inputProps?.className, error ? "border-red-500" : "")}
        />
        {inputProps?.type === "password" && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={cn(
              "absolute inset-y-0 right-0 flex items-center pr-3",
              inputProps?.className
            )}
          >
            {showPassword ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
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
    </div>
  );
});
InputGroup.displayName = "InputGroup";

export { InputGroup };

export { Input };
