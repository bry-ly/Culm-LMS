import React from "react";

export function CornerBorders() {
  return (
    <>
      {/* Top Left */}
      <span className="absolute top-0 left-0 h-2 w-2 border-l border-t border-primary pointer-events-none" />
      {/* Top Right */}
      <span className="absolute top-0 right-0 h-2 w-2 border-r border-t border-primary pointer-events-none" />
      {/* Bottom Left */}
      <span className="absolute bottom-0 left-0 h-2 w-2 border-l border-b border-primary pointer-events-none" />
      {/* Bottom Right */}
      <span className="absolute bottom-0 right-0 h-2 w-2 border-r border-b border-primary pointer-events-none" />
    </>
  );
}
