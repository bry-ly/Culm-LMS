"use client";

import { useState } from "react";
import { CategoryForm } from "./CategoryForm";

interface CategoryFormWrapperProps {
  children: React.ReactNode;
}

export function CategoryFormWrapper({ children }: CategoryFormWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <CategoryForm open={open} onOpenChange={setOpen} />
    </>
  );
}
