import "server-only";

import { render } from "@react-email/components";
import CourseCompletionEmail from "@/emails/course-completion";
import prisma from "@/lib/db";
import { resend } from "@/lib/resend";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export async function checkAndSendCourseCompletionEmail(
  userId: string,
  lessonId: string
): Promise<void> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    select: {
      chapter: {
        select: {
          course: {
            select: {
              id: true,
              title: true,
              chapter: {
                select: {
                  lesson: {
                    select: { id: true },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!lesson) return;

  const course = lesson.chapter.course;
  const allLessonIds = course.chapter.flatMap((chapter) =>
    chapter.lesson.map((l) => l.id)
  );

  if (allLessonIds.length === 0) return;

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completed: true,
    },
  });

  if (completedLessons !== allLessonIds.length) return;

  const existingCompletion = await prisma.lessonProgress.findFirst({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      completed: true,
    },
    orderBy: { updatedtAt: "desc" },
    select: { updatedtAt: true },
  });

  const recentlyCompleted =
    existingCompletion &&
    Date.now() - existingCompletion.updatedtAt.getTime() < 60000;

  if (!recentlyCompleted) return;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  if (!user) return;

  const html = await render(
    CourseCompletionEmail({
      userName: user.name,
      courseTitle: course.title,
      completedAt: formatDate(new Date()),
    })
  );
  const text = await render(
    CourseCompletionEmail({
      userName: user.name,
      courseTitle: course.title,
      completedAt: formatDate(new Date()),
    }),
    { plainText: true }
  );

  await resend.emails.send({
    from: "Culm LMS <send@bryanpalay.me>",
    to: [user.email],
    subject: `Congratulations! You've completed ${course.title}`,
    html,
    text,
  });
}
