import React from "react";

export function CornerBorders() {
  return (
    <>
      {/* Top Left */}
      <span className="border-primary pointer-events-none absolute top-0 left-0 h-2 w-2 border-t border-l" />
      {/* Top Right */}
      <span className="border-primary pointer-events-none absolute top-0 right-0 h-2 w-2 border-t border-r" />
      {/* Bottom Left */}
      <span className="border-primary pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l" />
      {/* Bottom Right */}
      <span className="border-primary pointer-events-none absolute right-0 bottom-0 h-2 w-2 border-r border-b" />
    </>
  );
}
