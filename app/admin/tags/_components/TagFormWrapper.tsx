"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { TagForm } from "./TagForm";

export function TagFormWrapper() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <IconPlus className="mr-2 size-4" />
        Add Tag
      </Button>
      <TagForm open={open} onOpenChange={setOpen} />
    </>
  );
}
