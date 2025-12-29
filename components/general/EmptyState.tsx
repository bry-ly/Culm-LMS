"use client";

import { BookOpen, FileQuestion, PlusCircle, PlusIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export function EmptyCourseState() {
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
          <EmptyMedia variant="icon" className="mx-auto size-12 bg-primary/10 text-primary">
            <BookOpen className="size-8" />
          </EmptyMedia>
        </motion.div>
        <EmptyTitle className="mt-4 text-xl font-bold">No courses found</EmptyTitle>
        <EmptyDescription className="text-base text-muted-foreground">Get started by creating a new course.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link className={buttonVariants({
          variant:"outline"
        })} href="/admin/courses/create">
          <PlusCircle className="size-4 " />
          Create Course
        </Link>
      </EmptyContent>
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
          <EmptyMedia variant="icon" className="mx-auto size-12 bg-muted text-muted-foreground">
            <FileQuestion className="size-8" />
          </EmptyMedia>
        </motion.div>
        <EmptyTitle className="mt-4 text-xl font-bold">No chapters found</EmptyTitle>
        <EmptyDescription className="text-base text-muted-foreground">This course has no chapters yet.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
