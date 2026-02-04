"use client";

import { ReactNode, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { QuestionForm } from "./QuestionForm";
import { AdminQuizDetailType } from "@/app/data/admin/admin-get-quiz";

type Question = AdminQuizDetailType["questions"][number];

interface QuestionFormWrapperProps {
  children: ReactNode;
  quizId: string;
  question?: Question;
}

export function QuestionFormWrapper({
  children,
  quizId,
  question,
}: QuestionFormWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <QuestionForm
        quizId={quizId}
        question={question}
        onSuccess={() => setOpen(false)}
      />
    </Dialog>
  );
}
