"use client";

import { BookOpen, FileQuestion, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

interface EmptyCourseStateProps {
  title?: string;
  description?: string;
  buttonText?: string | null;
  href?: string | null;
}

export function EmptyCourseState({
  title = "No courses found",
  description = "Get started by creating a new course.",
  buttonText,
  href,
}: EmptyCourseStateProps) {
  const showButton = buttonText && href;

  return (
    <Empty className="min-h-100 flex-col items-center justify-center border-none">
      <EmptyHeader className="mb-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.5,
          }}
        >
          <EmptyMedia
            variant="icon"
            className="bg-primary/10 text-primary mx-auto size-12"
          >
            <BookOpen className="size-8" />
          </EmptyMedia>
        </motion.div>
        <EmptyTitle className="mt-4 text-xl font-bold">{title}</EmptyTitle>
        <EmptyDescription className="text-muted-foreground text-base">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      {showButton && (
        <EmptyContent>
          <Link
            className={buttonVariants({
              variant: "outline",
            })}
            href={href}
          >
            <PlusCircle className="size-4" />
            {buttonText}
          </Link>
        </EmptyContent>
      )}
    </Empty>
  );
}

export function EmptyChapterState() {
  return (
    <Empty className="min-h-100 flex-col items-center justify-center border-none">
      <EmptyHeader className="mb-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.5,
          }}
        >
          <EmptyMedia
            variant="icon"
            className="bg-muted text-muted-foreground mx-auto size-12"
          >
            <FileQuestion className="size-8" />
          </EmptyMedia>
        </motion.div>
        <EmptyTitle className="mt-4 text-xl font-bold">
          No chapters found
        </EmptyTitle>
        <EmptyDescription className="text-muted-foreground text-base">
          This course has no chapters yet.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
