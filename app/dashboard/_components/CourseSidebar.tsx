"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import { LessonItem } from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { useMemo } from "react";

interface iAppProps {
  course: CourseSidebarDataType;
}

export function CourseSidebar({ course }: iAppProps) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();

  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress({ courseData: course });

  // Build O(1) lookup map for lesson completion status
  const completedLessonsMap = useMemo(() => {
    const map = new Set<string>();
    course.chapter.forEach((chapter) => {
      chapter.lesson.forEach((lesson) => {
        if (lesson.lessonProgress.some((p) => p.completed)) {
          map.add(lesson.id);
        }
      });
    });
    return map;
  }, [course]);
  return (
    <div className="flex h-full flex-col">
      <div className="border-border border-b pr-4 pb-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Play className="text-primary size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base leading-tight font-semibold">
              {course.title}
            </h1>
            <p className="text-muted-foreground mt-1 truncate text-xs">
              {course.category}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-muted-foreground text-xs">
            {progressPercentage}%complete
          </p>
        </div>
      </div>
      <div className="space-y-3 py-4 pr-4">
        {course.chapter.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="flex h-auto w-full items-center gap-2 p-3"
              >
                <div className="shrink-0">
                  <ChevronDown className="text-primary size-4" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {chapter.position}:{chapter.title}
                  </p>
                  <p className="text-muted-foreground truncate text-[10px] font-medium">
                    {chapter.lesson.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3 border-l-2 pl-6">
              {chapter.lesson.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                  isActive={currentLessonId === lesson.id}
                  completed={completedLessonsMap.has(lesson.id)}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
