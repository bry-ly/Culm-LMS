"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ReactNode, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileCourseSidebarProps {
  children: ReactNode;
}

export function MobileCourseSidebar({ children }: MobileCourseSidebarProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed right-4 bottom-4 z-50 size-12 rounded-full shadow-lg md:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <Menu className="size-6" />
          <span className="sr-only">Toggle Course Sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[80%] max-w-[320px] p-0 pt-10 pb-[env(safe-area-inset-bottom)]"
      >
        <div className="h-full overflow-y-auto">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
