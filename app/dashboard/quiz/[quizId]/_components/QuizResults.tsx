"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IconCheck, IconX, IconTrophy, IconRefresh } from "@tabler/icons-react";
import type { StudentQuizType } from "@/app/data/course/get-quiz-for-student";

type AnswerType = string | string[] | Record<string, string>;

type QuestionResult = {
  questionId: string;
  correct: boolean;
  userAnswer: AnswerType;
  correctAnswer: AnswerType;
  explanation: string | null;
  points: number;
  earnedPoints: number;
};

interface QuizResultsProps {
  results: {
    status: "success";
    score: number;
    totalPoints: number;
    percentage: number;
    passed: boolean;
    results: QuestionResult[];
  };
  quiz: NonNullable<StudentQuizType>;
  passingScore: number;
}

export function QuizResults({ results, quiz, passingScore }: QuizResultsProps) {
  const questionsMap = new Map(quiz.questions.map((q) => [q.id, q]));

  const formatAnswer = (answer: AnswerType, questionType?: string): string => {
    if (!answer) return "No answer";

    // Handle matching type - display as pairs
    if (
      questionType === "Matching" &&
      typeof answer === "object" &&
      !Array.isArray(answer)
    ) {
      const entries = Object.entries(answer as Record<string, string>);
      if (entries.length === 0) return "No answer";
      return entries.map(([left, right]) => `${left} → ${right}`).join("; ");
    }

    // Handle array types (MultiSelect, FillInBlank)
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "No answer";
      return answer.join(", ");
    }

    // Handle string types
    return String(answer) || "No answer";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2 text-center">
          <div className="mx-auto mb-4">
            {results.passed ? (
              <div className="flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <IconTrophy className="size-8 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <IconRefresh className="size-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {results.passed ? "Congratulations!" : "Keep Practicing!"}
          </CardTitle>
          <p className="text-muted-foreground">
            {results.passed
              ? "You passed the quiz!"
              : `You need ${passingScore}% to pass. Try again!`}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold">{results.score}</div>
              <div className="text-muted-foreground text-sm">
                of {results.totalPoints} points
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">{results.percentage}%</div>
              <div className="text-muted-foreground text-sm">Score</div>
            </div>
            <div>
              <Badge
                variant={results.passed ? "default" : "destructive"}
                className="px-4 py-1 text-lg"
              >
                {results.passed ? "PASSED" : "FAILED"}
              </Badge>
            </div>
          </div>
          <Progress value={results.percentage} className="h-3" />
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>0%</span>
            <span>Passing: {passingScore}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold">Question Review</h2>

      <div className="space-y-4">
        {results.results.map((result, idx) => {
          const question = questionsMap.get(result.questionId);
          if (!question) return null;

          return (
            <Card
              key={result.questionId}
              className={result.correct ? "border-green-200" : "border-red-200"}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                        result.correct
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {result.correct ? (
                        <IconCheck className="size-4" />
                      ) : (
                        <IconX className="size-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-muted-foreground text-sm">
                        Question {idx + 1}
                      </span>
                      <CardTitle className="text-base font-medium">
                        {question.questionText}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    {result.earnedPoints}/{result.points} pts
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Your answer: </span>
                  <span
                    className={
                      result.correct ? "text-green-600" : "text-red-600"
                    }
                  >
                    {formatAnswer(result.userAnswer, question.questionType)}
                  </span>
                </div>
                {!result.correct && (
                  <div>
                    <span className="text-sm font-medium">
                      Correct answer:{" "}
                    </span>
                    <span className="text-green-600">
                      {formatAnswer(
                        result.correctAnswer,
                        question.questionType
                      )}
                    </span>
                  </div>
                )}
                {result.explanation && (
                  <div className="bg-muted rounded-md p-3">
                    <span className="text-sm font-medium">Explanation: </span>
                    <span className="text-muted-foreground text-sm">
                      {result.explanation}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center gap-4 pt-4">
        {quiz.lesson && (
          <Button asChild variant="outline">
            <Link
              href={`/dashboard/${quiz.lesson.chapter.course.id}/${quiz.lesson.id}`}
            >
              Return to Lesson
            </Link>
          </Button>
        )}
        <Button asChild>
          <Link href="/dashboard/courses">Browse Courses</Link>
        </Button>
      </div>
    </div>
  );
}
