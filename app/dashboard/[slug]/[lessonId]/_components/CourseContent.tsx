"use client";

import Link from "next/link";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import {
  IconClipboardList,
  IconClock,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { VideoPlayer } from "./VideoPlayer";
import { toast } from "sonner";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { MarkLessonComplete } from "../actions";

interface iAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarkLessonComplete(data.id, data.chapter.course.slug)
      );

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="bg-background flex h-full flex-col pl-6">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoKey={data.videoKey ?? ""}
      />
      <div className="border-b py-4">
        {data.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500 hover:text-green-500"
          >
            <CheckCircle className="mr-2 size-4 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={pending}>
            <CheckCircle className="mr-2 size-4 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-foreground text-3xl font-bold tracking-tight">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>

      {data.quizzes.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <IconClipboardList className="size-5" />
            Lesson Quizzes
          </h2>
          <div className="grid gap-4">
            {data.quizzes.map((quiz) => {
              const bestAttempt = quiz.attempts.find((a) => a.passed);
              const latestAttempt = quiz.attempts[0];
              const attemptCount = quiz.attempts.filter(
                (a) => a.status === "Completed"
              ).length;
              const canRetake =
                quiz.allowRetake &&
                (!quiz.maxAttempts || attemptCount < quiz.maxAttempts);

              return (
                <Card key={quiz.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                        {quiz.description && (
                          <p className="text-muted-foreground mt-1 text-sm">
                            {quiz.description}
                          </p>
                        )}
                      </div>
                      {bestAttempt ? (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          <IconCheck className="mr-1 size-3" />
                          Passed
                        </Badge>
                      ) : latestAttempt?.status === "Completed" ? (
                        <Badge variant="destructive">
                          <IconX className="mr-1 size-3" />
                          Not Passed
                        </Badge>
                      ) : null}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-muted-foreground mb-4 flex flex-wrap items-center gap-4 text-sm">
                      <span>{quiz._count.questions} questions</span>
                      <span>Passing: {quiz.passingScore}%</span>
                      {quiz.timeLimit && (
                        <span className="flex items-center gap-1">
                          <IconClock className="size-4" />
                          {quiz.timeLimit} min
                        </span>
                      )}
                      {attemptCount > 0 && (
                        <span>
                          {attemptCount} attempt{attemptCount !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    {latestAttempt?.status === "Completed" && (
                      <div className="bg-muted mb-4 rounded-md p-3">
                        <div className="text-sm">
                          <span className="font-medium">Best score: </span>
                          <span
                            className={
                              bestAttempt
                                ? "text-green-500"
                                : "text-muted-foreground"
                            }
                          >
                            {bestAttempt?.percentage ??
                              latestAttempt.percentage}
                            %
                          </span>
                          {quiz.maxAttempts && (
                            <span className="ml-4">
                              Attempts: {attemptCount}/{quiz.maxAttempts}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <Button asChild disabled={!canRetake && attemptCount > 0}>
                      <Link href={`/dashboard/quiz/${quiz.id}`}>
                        {attemptCount === 0
                          ? "Start Quiz"
                          : canRetake
                            ? "Retake Quiz"
                            : "View Results"}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
