"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-500" />,
        info: <InfoIcon className="size-4 text-blue-500" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
        error: <OctagonXIcon className="size-4 text-red-500" />,
        loading: (
          <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": "oklch(0.95 0.05 155)",
          "--success-text": "oklch(0.3 0.1 155)",
          "--success-border": "oklch(0.85 0.1 155)",
          "--error-bg": "oklch(0.95 0.05 25)",
          "--error-text": "oklch(0.35 0.15 25)",
          "--error-border": "oklch(0.85 0.1 25)",
          "--warning-bg": "oklch(0.95 0.05 85)",
          "--warning-text": "oklch(0.35 0.1 85)",
          "--warning-border": "oklch(0.85 0.1 85)",
          "--info-bg": "oklch(0.95 0.03 250)",
          "--info-text": "oklch(0.35 0.1 250)",
          "--info-border": "oklch(0.85 0.08 250)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
