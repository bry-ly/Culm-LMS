import { cn } from "@/lib/utils";
import React from "react";

interface PatternCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

import { CornerBorders } from "@/components/ui/corner-borders";

export function PatternCard({
  className,
  children,
  ...props
}: PatternCardProps) {
  return (
    <div
      className={cn("bg-pattern-striped relative p-6", className)}
      {...props}
    >
      <CornerBorders />
      {children}
    </div>
  );
}
