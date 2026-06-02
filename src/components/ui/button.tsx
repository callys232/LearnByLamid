import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold",
    "transition-all duration-150",
    "disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
    "active:scale-[0.97]",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-primary-sm hover:bg-primary-hover hover:shadow-primary hover:-translate-y-px",
        secondary:
          "bg-surface text-text-primary border border-border shadow-soft hover:bg-surface-hover hover:shadow-soft-md hover:-translate-y-px",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-surface",
        danger:
          "bg-red-900/30 text-red-400 border border-red-900/50 hover:bg-red-900/50 hover:-translate-y-px",
        outline:
          "border border-primary text-primary hover:bg-primary-muted hover:shadow-primary-sm",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
