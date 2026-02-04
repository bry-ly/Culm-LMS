import { Suspense } from "react";
import { getQuizAttemptDetail } from "@/app/data/user/get-quiz-attempt-detail";
import {
  AttemptDetail,
  AttemptDetailSkeleton,
} from "./_components/AttemptDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz Attempt Details",
  description: "View your quiz attempt details",
};

type Params = Promise<{ attemptId: string }>;

async function AttemptLoader({ attemptId }: { attemptId: string }) {
  const attempt = await getQuizAttemptDetail(attemptId);
  return <AttemptDetail attempt={attempt} />;
}

export default async function QuizAttemptDetailPage({
  params,
}: {
  params: Params;
}) {
  const { attemptId } = await params;

  return (
    <div className="container max-w-4xl py-8">
      <Suspense fallback={<AttemptDetailSkeleton />}>
        <AttemptLoader attemptId={attemptId} />
      </Suspense>
    </div>
  );
}
