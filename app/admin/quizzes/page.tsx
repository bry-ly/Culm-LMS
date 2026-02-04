import { Suspense } from "react";
import { IconQuestionMark, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { adminGetQuizzes } from "@/app/data/admin/admin-get-quizzes";
import { adminGetLessonsForSelect } from "@/app/data/admin/admin-get-lessons-for-select";
import { adminGetChaptersForSelect } from "@/app/data/admin/admin-get-chapters-for-select";
import { QuizzesTable } from "./_components/QuizzesTable";
import { QuizFormWrapper } from "./_components/QuizFormWrapper";

export default async function QuizzesPage() {
  const [lessons, chapters] = await Promise.all([
    adminGetLessonsForSelect(),
    adminGetChaptersForSelect(),
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <IconQuestionMark className="text-primary size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quizzes</h1>
            <p className="text-muted-foreground text-sm">
              Create and manage quizzes for your courses.
            </p>
          </div>
        </div>
        <QuizFormWrapper lessons={lessons} chapters={chapters}>
          <Button>
            <IconPlus className="mr-2 size-4" />
            Create Quiz
          </Button>
        </QuizFormWrapper>
      </div>

      <Suspense fallback={<QuizzesTableSkeleton />}>
        <QuizzesLoader lessons={lessons} chapters={chapters} />
      </Suspense>
    </div>
  );
}

async function QuizzesLoader({
  lessons,
  chapters,
}: {
  lessons: Awaited<ReturnType<typeof adminGetLessonsForSelect>>;
  chapters: Awaited<ReturnType<typeof adminGetChaptersForSelect>>;
}) {
  const quizzes = await adminGetQuizzes();
  return (
    <QuizzesTable quizzes={quizzes} lessons={lessons} chapters={chapters} />
  );
}

function QuizzesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  );
}
