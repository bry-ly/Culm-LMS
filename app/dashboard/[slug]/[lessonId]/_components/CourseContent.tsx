"use client";

import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { VideoPlayer } from "./VideoPlayer";
import { toast } from "sonner";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { MarkLessonComplete } from "../actions";

interface iAppProps {
  data: LessonContentType;
}

export function CourseContent({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(MarkLessonComplete(data.id, data.chapter.course.slug));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer thumbnailKey={data.thumbnailKey ?? ""} videoKey={data.videoKey ?? ""} />
      <div className="py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <Button variant="outline" className="bg-green-500/10 text-green-500 hover:text-green-500 ">
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button variant="outline" onClick={onSubmit} disabled={pending}>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>
      <div className="space-y-3 pt-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{data.title}</h1>
        {data.description && <RenderDescription json={JSON.parse(data.description)} />}
      </div>
    </div>
  );
}
