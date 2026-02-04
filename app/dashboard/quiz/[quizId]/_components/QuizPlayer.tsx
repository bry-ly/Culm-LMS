"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { startQuizAttempt, submitQuizAttempt } from "../actions";
import { QuestionCard } from "./QuestionCard";
import { QuizResults } from "./QuizResults";
import type { StudentQuizType } from "@/app/data/course/get-quiz-for-student";

interface QuizPlayerProps {
  quiz: NonNullable<StudentQuizType>;
}

// Answer type that's actually stored (no undefined)
type StoredAnswerType = string | string[] | Record<string, string>;

type QuestionResult = {
  questionId: string;
  correct: boolean;
  userAnswer: StoredAnswerType;
  correctAnswer: StoredAnswerType;
  explanation: string | null;
  points: number;
  earnedPoints: number;
};

type ResultResponse =
  | {
      status: "success";
      score: number;
      totalPoints: number;
      percentage: number;
      passed: boolean;
      results: QuestionResult[];
    }
  | { status: "error"; message: string };

export function QuizPlayer({ quiz }: QuizPlayerProps) {
  const router = useRouter();
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, StoredAnswerType>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<ResultResponse | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize shuffled questions once using useState initializer
  const [questions] = useState(() => {
    const qs = [...quiz.questions];
    if (quiz.shuffleQuestions) {
      // Seeded shuffle using a deterministic approach based on quiz id
      const seed = quiz.id
        .split("")
        .reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const seededRandom = (i: number) => {
        const x = Math.sin(seed + i) * 10000;
        return x - Math.floor(x);
      };
      for (let i = qs.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(i) * (i + 1));
        [qs[i], qs[j]] = [qs[j], qs[i]];
      }
    }
    return qs;
  });

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    async function init() {
      const { data, error } = await tryCatch(startQuizAttempt(quiz.id));
      if (error) {
        toast.error(error.message || "Failed to start quiz");
        setIsLoading(false);
        return;
      }
      if (data.status === "error") {
        toast.error(data.message || "Failed to start quiz");
        setIsLoading(false);
        return;
      }
      setAttemptId(data.attemptId);
      if (quiz.timeLimit) {
        setTimeRemaining(quiz.timeLimit * 60);
      }
      setIsLoading(false);
    }
    init();
  }, [quiz.id, quiz.timeLimit]);

  // Use refs to access current state in timer callback without causing re-renders
  const answersRef = useRef(answers);
  const attemptIdRef = useRef(attemptId);
  const isSubmittingRef = useRef(isSubmitting);

  // Keep refs in sync with state
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    attemptIdRef.current = attemptId;
  }, [attemptId]);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  // Auto-submit function that uses refs
  const autoSubmit = async () => {
    const currentAttemptId = attemptIdRef.current;
    if (!currentAttemptId || isSubmittingRef.current) return;

    setIsSubmitting(true);
    const { data, error } = await tryCatch(
      submitQuizAttempt(currentAttemptId, {
        quizId: quiz.id,
        answers: answersRef.current,
      })
    );
    if (error) {
      toast.error(error.message || "Failed to submit quiz");
      setIsSubmitting(false);
      return;
    }
    if (data.status === "error") {
      toast.error(data.message || "Failed to submit quiz");
      setIsSubmitting(false);
      return;
    }
    setResults(data);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          // Trigger auto-submit when time runs out
          if (prev === 1) {
            autoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  const handleSubmit = async () => {
    if (!attemptId) return;
    setIsSubmitting(true);
    const { data, error } = await tryCatch(
      submitQuizAttempt(attemptId, { quizId: quiz.id, answers })
    );
    if (error) {
      toast.error(error.message || "Failed to submit quiz");
      setIsSubmitting(false);
      return;
    }
    if (data.status === "error") {
      toast.error(data.message || "Failed to submit quiz");
      setIsSubmitting(false);
      return;
    }
    setResults(data);
    setIsSubmitting(false);
  };

  const handleAnswerChange = (
    questionId: string,
    answer: StoredAnswerType | undefined
  ) => {
    if (answer === undefined) return;
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading) {
    return <QuizSkeleton />;
  }

  if (results && results.status === "success") {
    return (
      <QuizResults
        results={results}
        quiz={quiz}
        passingScore={quiz.passingScore}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-semibold">No questions available</h2>
        <p className="text-muted-foreground mt-2">
          This quiz does not have any questions yet.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/dashboard/courses")}
        >
          Back to Courses
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-muted-foreground text-sm">
                {quiz.description}
              </p>
            )}
          </div>
          {timeRemaining !== null && (
            <div className="text-right">
              <div className="text-muted-foreground text-sm">
                Time Remaining
              </div>
              <div
                className={`font-mono text-lg font-semibold ${
                  timeRemaining < 60 ? "text-red-500" : ""
                }`}
              >
                {formatTime(timeRemaining)}
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="flex items-center gap-4">
        <Progress
          value={(answeredCount / totalQuestions) * 100}
          className="flex-1"
        />
        <span className="text-muted-foreground text-sm whitespace-nowrap">
          {answeredCount} of {totalQuestions} answered
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentQuestionIndex;
          return (
            <button
              key={q.id}
              onClick={() => handleNavigate(idx)}
              className={`size-8 rounded-md text-sm font-medium transition-colors ${
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : isAnswered
                    ? "bg-primary/20 text-primary hover:bg-primary/30"
                    : "bg-muted hover:bg-muted/80"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <QuestionCard
        question={currentQuestion}
        answer={answers[currentQuestion.id]}
        onAnswerChange={(answer) =>
          handleAnswerChange(currentQuestion.id, answer)
        }
      />

      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={() => handleNavigate(currentQuestionIndex - 1)}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount < totalQuestions}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={() => handleNavigate(currentQuestionIndex + 1)}>
              Next
            </Button>
          )}
        </div>
      </div>

      {answeredCount < totalQuestions && (
        <p className="text-muted-foreground text-center text-sm">
          You have {totalQuestions - answeredCount} unanswered question
          {totalQuestions - answeredCount !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}

export function QuizSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-32" />
      </Card>
      <div className="flex items-center gap-4">
        <Skeleton className="h-2 flex-1" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="size-8" />
        ))}
      </div>
      <Card className="space-y-4 p-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}
