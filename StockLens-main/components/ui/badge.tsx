import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-border-strong bg-white/[0.05] text-foreground",
        positive: "border-emerald/30 bg-emerald-soft text-emerald",
        negative: "border-red/30 bg-red-soft text-red",
        warning: "border-amber/30 bg-amber-soft text-amber",
        neutral: "border-border-strong bg-white/[0.05] text-muted-2",
        outline: "border-border-strong text-muted-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
