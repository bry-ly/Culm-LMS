"use client";

import Link from "next/link";
import { format } from "date-fns";
import { AllUserQuizAttemptsType } from "@/app/data/user/get-all-user-quiz-attempts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCheck,
  IconX,
  IconClock,
  IconClipboardList,
  IconEye,
} from "@tabler/icons-react";

interface QuizHistoryListProps {
  attempts: AllUserQuizAttemptsType;
}

export function QuizHistoryList({ attempts }: QuizHistoryListProps) {
  if (attempts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <IconClipboardList className="text-muted-foreground mb-4 size-12" />
          <h3 className="mb-2 text-lg font-medium">No quiz attempts yet</h3>
          <p className="text-muted-foreground text-sm">
            Complete a quiz to see your history here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {attempts.map((attempt) => {
        const course =
          attempt.quiz.lesson?.chapter.course ?? attempt.quiz.chapter?.course;
        const location = attempt.quiz.lesson
          ? `${attempt.quiz.lesson.chapter.title} → ${attempt.quiz.lesson.title}`
          : attempt.quiz.chapter?.title;

        return (
          <Card key={attempt.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    {attempt.quiz.title}
                  </CardTitle>
                  {course && (
                    <p className="text-muted-foreground text-sm">
                      {course.title}
                      {location && ` • ${location}`}
                    </p>
                  )}
                </div>
                {attempt.passed ? (
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    <IconCheck className="mr-1 size-3" />
                    Passed
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <IconX className="mr-1 size-3" />
                    Not Passed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
                  <span className="font-medium">
                    Score:{" "}
                    <span
                      className={
                        attempt.passed ? "text-green-500" : "text-destructive"
                      }
                    >
                      {attempt.percentage}%
                    </span>
                    <span className="text-muted-foreground ml-1">
                      ({attempt.score}/{attempt.totalPoints} points)
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <IconClock className="size-4" />
                    {attempt.completedAt
                      ? format(
                          new Date(attempt.completedAt),
                          "MMM d, yyyy h:mm a"
                        )
                      : "In Progress"}
                  </span>
                  {attempt.status === "TimedOut" && (
                    <Badge variant="secondary">Timed Out</Badge>
                  )}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/quiz/attempt/${attempt.id}`}>
                    <IconEye className="mr-1 size-4" />
                    View Details
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export function QuizHistorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-9 w-28" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
