import { Suspense } from "react";
import { getAllUserQuizAttempts } from "@/app/data/user/get-all-user-quiz-attempts";
import {
  QuizHistoryList,
  QuizHistorySkeleton,
} from "./_components/QuizHistoryList";

export const metadata = {
  title: "Quiz History",
  description: "View your quiz attempt history",
};

async function QuizHistoryLoader() {
  const attempts = await getAllUserQuizAttempts();
  return <QuizHistoryList attempts={attempts} />;
}

export default function QuizHistoryPage() {
  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Quiz History</h1>
        <p className="text-muted-foreground mt-2">
          Review all your quiz attempts and scores
        </p>
      </div>
      <Suspense fallback={<QuizHistorySkeleton />}>
        <QuizHistoryLoader />
      </Suspense>
    </div>
  );
}
