import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
    "transition-all duration-150 animate-scale-in",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "bg-surface-active text-text-secondary border border-border hover:border-border-strong",
        primary:
          "bg-primary-muted text-primary border border-primary/20 hover:bg-primary/20",
        success:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/15",
        warning: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        danger: "bg-red-500/10 text-red-400 border border-red-500/20",
        hcd: "bg-primary-muted text-primary border border-primary/20",
        biz: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        sd: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
