"use client";

import Link from "next/link";
import { format } from "date-fns";
import { QuizAttemptDetailType } from "@/app/data/user/get-quiz-attempt-detail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconCheck,
  IconX,
  IconClock,
  IconArrowLeft,
  IconHelpCircle,
  IconHome,
  IconClipboardCheck,
} from "@tabler/icons-react";

interface AttemptDetailProps {
  attempt: QuizAttemptDetailType;
}

type AnswerType = string | string[] | Record<string, string>;

export function AttemptDetail({ attempt }: AttemptDetailProps) {
  const course =
    attempt.quiz.lesson?.chapter.course ?? attempt.quiz.chapter?.course;
  const location = attempt.quiz.lesson
    ? `${attempt.quiz.lesson.chapter.title} → ${attempt.quiz.lesson.title}`
    : attempt.quiz.chapter?.title;

  const answers = attempt.answers as Record<string, AnswerType>;

  const getQuestionAnswer = (questionId: string): AnswerType => {
    return answers[questionId];
  };

  const formatAnswer = (
    answer: AnswerType | undefined,
    questionType?: string
  ): string => {
    if (!answer) return "Not answered";

    // Handle matching type - display as pairs
    if (
      questionType === "Matching" &&
      typeof answer === "object" &&
      !Array.isArray(answer)
    ) {
      const entries = Object.entries(answer as Record<string, string>);
      if (entries.length === 0) return "Not answered";
      return entries.map(([left, right]) => `${left} → ${right}`).join("; ");
    }

    // Handle array types (MultiSelect, FillInBlank)
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "Not answered";
      return answer.join(", ");
    }

    // Handle string types
    return String(answer) || "Not answered";
  };

  const isAnswerCorrect = (
    question: (typeof attempt.quiz.questions)[number],
    userAnswer: AnswerType | undefined
  ): boolean => {
    if (!userAnswer) return false;

    const correctAnswer = question.correctAnswer as AnswerType;

    switch (question.questionType) {
      case "MultiSelect":
      case "FillInBlank": {
        if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer))
          return false;
        const sortedUser =
          question.questionType === "MultiSelect"
            ? [...userAnswer].sort()
            : userAnswer;
        const sortedCorrect =
          question.questionType === "MultiSelect"
            ? [...correctAnswer].sort()
            : correctAnswer;

        if (question.questionType === "FillInBlank") {
          return (
            sortedUser.length === sortedCorrect.length &&
            sortedUser.every(
              (a, i) =>
                a?.toString().trim().toLowerCase() ===
                sortedCorrect[i]?.toString().trim().toLowerCase()
            )
          );
        }

        return (
          sortedUser.length === sortedCorrect.length &&
          sortedUser.every((a, i) => a === sortedCorrect[i])
        );
      }

      case "Matching": {
        const userMatches =
          typeof userAnswer === "object" && !Array.isArray(userAnswer)
            ? (userAnswer as Record<string, string>)
            : {};
        let correctMatches: Record<string, string> = {};

        if (typeof correctAnswer === "string") {
          try {
            correctMatches = JSON.parse(correctAnswer);
          } catch {
            correctMatches = {};
          }
        } else if (
          typeof correctAnswer === "object" &&
          !Array.isArray(correctAnswer)
        ) {
          correctMatches = correctAnswer as Record<string, string>;
        }

        const userKeys = Object.keys(userMatches).sort();
        const correctKeys = Object.keys(correctMatches).sort();

        return (
          userKeys.length === correctKeys.length &&
          userKeys.every((key) => userMatches[key] === correctMatches[key])
        );
      }

      case "ShortAnswer": {
        const userText =
          typeof userAnswer === "string" ? userAnswer.trim().toLowerCase() : "";
        const correctText =
          typeof correctAnswer === "string"
            ? correctAnswer.trim().toLowerCase()
            : "";

        if (userText === correctText) return true;

        // Check keyword matching
        const keywords = question.options as string[] | null;
        if (keywords && keywords.length > 0) {
          const matchedKeywords = keywords.filter((kw) =>
            userText.includes(kw.toLowerCase())
          );
          return matchedKeywords.length >= Math.ceil(keywords.length / 2);
        }

        return false;
      }

      default:
        return userAnswer === correctAnswer;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/quiz/history">
            <IconArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {attempt.quiz.title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {course?.title} {location && `• ${location}`}
          </p>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Attempt Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-sm">Score</p>
              <p
                className={`text-2xl font-bold ${
                  attempt.passed ? "text-green-500" : "text-destructive"
                }`}
              >
                {attempt.percentage}%
              </p>
              <p className="text-muted-foreground text-xs">
                {attempt.score}/{attempt.totalPoints} points
              </p>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-sm">Status</p>
              <div className="mt-1">
                {attempt.passed ? (
                  <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                    <IconCheck className="mr-1 size-3" />
                    Passed
                  </Badge>
                ) : attempt.status === "TimedOut" ? (
                  <Badge variant="secondary">
                    <IconClock className="mr-1 size-3" />
                    Timed Out
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <IconX className="mr-1 size-3" />
                    Not Passed
                  </Badge>
                )}
              </div>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-sm">Started</p>
              <p className="font-medium">
                {format(new Date(attempt.startedAt), "MMM d, yyyy")}
              </p>
              <p className="text-muted-foreground text-xs">
                {format(new Date(attempt.startedAt), "h:mm a")}
              </p>
            </div>

            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="font-medium">
                {attempt.completedAt
                  ? format(new Date(attempt.completedAt), "MMM d, yyyy")
                  : "—"}
              </p>
              <p className="text-muted-foreground text-xs">
                {attempt.completedAt
                  ? format(new Date(attempt.completedAt), "h:mm a")
                  : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quiz Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <IconClipboardCheck className="text-muted-foreground size-4" />
              <span className="text-muted-foreground">Passing Score:</span>
              <span className="font-medium">{attempt.quiz.passingScore}%</span>
            </div>
            {attempt.quiz.timeLimit && (
              <div className="flex items-center gap-2">
                <IconClock className="text-muted-foreground size-4" />
                <span className="text-muted-foreground">Time Limit:</span>
                <span className="font-medium">
                  {attempt.quiz.timeLimit} min
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <IconHelpCircle className="text-muted-foreground size-4" />
              <span className="text-muted-foreground">Questions:</span>
              <span className="font-medium">
                {attempt.quiz.questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <IconHome className="text-muted-foreground size-4" />
              <span className="text-muted-foreground">Attempts:</span>
              <span className="font-medium">
                {attempt.quiz._count.attempts}
                {attempt.quiz.maxAttempts ? `/${attempt.quiz.maxAttempts}` : ""}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Review */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Question Review</h2>
        {attempt.quiz.questions.map((question, index) => {
          const userAnswer = getQuestionAnswer(question.id);
          const correctAnswer = question.correctAnswer as AnswerType;
          const isCorrect = isAnswerCorrect(question, userAnswer);

          return (
            <Card key={question.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        Question {index + 1} of {attempt.quiz.questions.length}
                      </span>
                      <Badge variant="secondary">
                        {question.points}{" "}
                        {question.points === 1 ? "point" : "points"}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg leading-relaxed font-medium">
                      {question.questionText}
                    </CardTitle>
                  </div>
                  {isCorrect ? (
                    <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      <IconCheck className="mr-1 size-3" />
                      Correct
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <IconX className="mr-1 size-3" />
                      Incorrect
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">Your Answer:</p>
                  <p
                    className={
                      isCorrect ? "text-green-600" : "text-destructive"
                    }
                  >
                    {formatAnswer(userAnswer, question.questionType)}
                  </p>
                </div>

                {!isCorrect && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">
                      Correct Answer:
                    </p>
                    <p className="text-green-600">
                      {formatAnswer(correctAnswer, question.questionType)}
                    </p>
                  </div>
                )}

                {question.explanation && (
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-sm">
                      Explanation:
                    </p>
                    <p className="mt-1 text-sm">{question.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button asChild variant="outline">
          <Link href="/dashboard/quiz/history">
            <IconArrowLeft className="mr-2 size-4" />
            Back to History
          </Link>
        </Button>
        <Button asChild>
          <Link href={`/dashboard/quiz/${attempt.quiz.id}`}>
            <IconClipboardCheck className="mr-2 size-4" />
            {attempt.quiz.allowRetake &&
            (!attempt.quiz.maxAttempts ||
              attempt.quiz._count.attempts < attempt.quiz.maxAttempts)
              ? "Retake Quiz"
              : "View Quiz"}
          </Link>
        </Button>
      </div>
    </div>
  );
}

export function AttemptDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>

      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-6 w-96" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
