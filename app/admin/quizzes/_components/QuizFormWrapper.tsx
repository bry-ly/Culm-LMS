"use client";

import { useState } from "react";
import { QuizForm } from "./QuizForm";
import { AdminChaptersForSelectType } from "@/app/data/admin/admin-get-chapters-for-select";
import { AdminLessonsForSelectType } from "@/app/data/admin/admin-get-lessons-for-select";
import { AdminQuizType } from "@/app/data/admin/admin-get-quizzes";

interface QuizFormWrapperProps {
  children: React.ReactNode;
  lessons: AdminLessonsForSelectType;
  chapters: AdminChaptersForSelectType;
  quiz?: AdminQuizType;
}

export function QuizFormWrapper({
  children,
  lessons,
  chapters,
  quiz,
}: QuizFormWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setOpen(true)}>{children}</div>
      <QuizForm
        open={open}
        onOpenChange={setOpen}
        lessons={lessons}
        chapters={chapters}
        quiz={quiz}
      />
    </div>
  );
}
