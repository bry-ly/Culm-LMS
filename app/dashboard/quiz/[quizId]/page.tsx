import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getQuizForStudent } from "@/app/data/course/get-quiz-for-student";
import { QuizPlayer, QuizSkeleton } from "./_components/QuizPlayer";

type Params = Promise<{ quizId: string }>;

export default async function QuizPage({ params }: { params: Params }) {
  const { quizId } = await params;

  return (
    <Suspense fallback={<QuizSkeleton />}>
      <QuizLoader quizId={quizId} />
    </Suspense>
  );
}

async function QuizLoader({ quizId }: { quizId: string }) {
  const quiz = await getQuizForStudent(quizId);

  if (!quiz) {
    notFound();
  }

  return <QuizPlayer quiz={quiz} />;
}
