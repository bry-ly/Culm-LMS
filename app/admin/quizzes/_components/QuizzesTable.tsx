"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tryCatch } from "@/hooks/try-catch";
import { AdminQuizzesType } from "@/app/data/admin/admin-get-quizzes";
import { AdminChaptersForSelectType } from "@/app/data/admin/admin-get-chapters-for-select";
import { AdminLessonsForSelectType } from "@/app/data/admin/admin-get-lessons-for-select";
import {
  IconDots,
  IconEdit,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteQuiz } from "../actions";
import { QuizFormWrapper } from "./QuizFormWrapper";

interface QuizzesTableProps {
  quizzes: AdminQuizzesType;
  lessons: AdminLessonsForSelectType;
  chapters: AdminChaptersForSelectType;
}

export function QuizzesTable({
  quizzes,
  lessons,
  chapters,
}: QuizzesTableProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      const { error } = await tryCatch(deleteQuiz(id));
      if (error) {
        toast.error("Failed to delete quiz");
        return;
      }
      toast.success("Quiz deleted");
    });
  }

  if (quizzes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-medium">No quizzes yet</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Create your first quiz to test student knowledge.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Attached To</TableHead>
          <TableHead className="text-center">Questions</TableHead>
          <TableHead className="text-center">Attempts</TableHead>
          <TableHead className="text-center">Passing Score</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="w-[70px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes.map((quiz) => (
          <TableRow key={quiz.id}>
            <TableCell className="font-medium">
              <Link
                href={`/admin/quizzes/${quiz.id}`}
                className="hover:underline"
              >
                {quiz.title}
              </Link>
            </TableCell>
            <TableCell>
              {quiz.lesson ? (
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">
                    {quiz.lesson.chapter.course.title}
                  </span>
                  <span className="text-sm">
                    <Badge variant="outline" className="mr-1 text-xs">
                      Lesson
                    </Badge>
                    {quiz.lesson.title}
                  </span>
                </div>
              ) : quiz.chapter ? (
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-xs">
                    {quiz.chapter.course.title}
                  </span>
                  <span className="text-sm">
                    <Badge variant="outline" className="mr-1 text-xs">
                      Chapter
                    </Badge>
                    {quiz.chapter.title}
                  </span>
                </div>
              ) : (
                <Badge variant="secondary">Not attached</Badge>
              )}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline">{quiz._count.questions}</Badge>
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline">{quiz._count.attempts}</Badge>
            </TableCell>
            <TableCell className="text-center">{quiz.passingScore}%</TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {formatDistanceToNow(new Date(quiz.createdAt), {
                addSuffix: true,
              })}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    disabled={isPending}
                  >
                    <IconDots className="size-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/admin/quizzes/${quiz.id}`}>
                      <IconExternalLink className="mr-2 size-4" />
                      Manage Questions
                    </Link>
                  </DropdownMenuItem>
                  <QuizFormWrapper
                    lessons={lessons}
                    chapters={chapters}
                    quiz={quiz}
                  >
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <IconEdit className="mr-2 size-4" />
                      Edit Quiz
                    </DropdownMenuItem>
                  </QuizFormWrapper>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="text-destructive focus:text-destructive"
                      >
                        <IconTrash className="mr-2 size-4" />
                        Delete Quiz
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Quiz?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete &quot;{quiz.title}&quot;
                          along with all questions and student attempts. This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(quiz.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
