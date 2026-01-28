"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-md px-4 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/20">
              <AlertTriangle className="size-12 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Something went wrong
          </h1>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p className="mb-4 font-mono text-xs text-gray-500">
              Error ID: {error.digest}
            </p>
          )}
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw className="size-4" />
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
