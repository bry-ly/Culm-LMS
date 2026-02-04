import { Suspense } from "react";
import { adminGetQuiz } from "@/app/data/admin/admin-get-quiz";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionsTable } from "./_components/QuestionsTable";
import { QuestionFormWrapper } from "./_components/QuestionFormWrapper";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconArrowLeft,
  IconClock,
  IconTarget,
} from "@tabler/icons-react";
import Link from "next/link";

interface QuizDetailPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { quizId } = await params;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/quizzes">
            <IconArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Quiz Details</h1>
      </div>
      <Suspense fallback={<QuizDetailSkeleton />}>
        <QuizDetailLoader quizId={quizId} />
      </Suspense>
    </div>
  );
}

async function QuizDetailLoader({ quizId }: { quizId: string }) {
  const quiz = await adminGetQuiz(quizId);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{quiz.title}</CardTitle>
              {quiz.description && (
                <p className="text-muted-foreground mt-1 text-sm">
                  {quiz.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{quiz.questions.length} questions</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <IconTarget className="text-muted-foreground size-4" />
              <span>Passing: {quiz.passingScore}%</span>
            </div>
            {quiz.timeLimit && (
              <div className="flex items-center gap-2">
                <IconClock className="text-muted-foreground size-4" />
                <span>{quiz.timeLimit} min</span>
              </div>
            )}
            <div>
              <Badge variant={quiz.allowRetake ? "default" : "secondary"}>
                {quiz.allowRetake ? "Retakes allowed" : "No retakes"}
              </Badge>
            </div>
            {quiz.maxAttempts && (
              <span className="text-muted-foreground">
                Max {quiz.maxAttempts} attempts
              </span>
            )}
            {quiz.lesson && (
              <div className="text-muted-foreground">
                Lesson: {quiz.lesson.chapter.course.title} →{" "}
                {quiz.lesson.chapter.title} → {quiz.lesson.title}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle>Questions</CardTitle>
          <QuestionFormWrapper quizId={quiz.id}>
            <Button size="sm">
              <IconPlus className="mr-2 size-4" />
              Add Question
            </Button>
          </QuestionFormWrapper>
        </CardHeader>
        <CardContent className="pt-6">
          <QuestionsTable questions={quiz.questions} quizId={quiz.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function QuizDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="mt-2 h-4 w-96" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
