import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all active:translate-y-[1px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

const variantStyles: Record<ButtonVariant, string> = {
  default: "bg-black text-white hover:bg-black/90 focus-visible:outline-black",
  outline:
    "border border-border bg-white text-gray-900 hover:bg-gray-50 focus-visible:outline-gray-300",
  ghost: "text-gray-800 hover:bg-gray-100 focus-visible:outline-gray-200",
  secondary:
    "bg-gray-900/5 text-gray-900 hover:bg-gray-900/10 focus-visible:outline-gray-200",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      loading,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      aria-busy={loading}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
