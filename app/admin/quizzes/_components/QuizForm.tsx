"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { tryCatch } from "@/hooks/try-catch";
import { QuizFormValues, quizSchema } from "@/lib/zodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconLoader2 } from "@tabler/icons-react";
import { Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createQuiz, updateQuiz } from "../actions";
import { AdminChaptersForSelectType } from "@/app/data/admin/admin-get-chapters-for-select";
import { AdminLessonsForSelectType } from "@/app/data/admin/admin-get-lessons-for-select";
import { AdminQuizType } from "@/app/data/admin/admin-get-quizzes";

interface QuizFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lessons: AdminLessonsForSelectType;
  chapters: AdminChaptersForSelectType;
  quiz?: AdminQuizType;
}

export function QuizForm({
  open,
  onOpenChange,
  lessons,
  chapters,
  quiz,
}: QuizFormProps) {
  const isEditing = !!quiz;

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema) as Resolver<QuizFormValues>,
    defaultValues: {
      title: quiz?.title ?? "",
      description: quiz?.description ?? "",
      passingScore: quiz?.passingScore ?? 70,
      timeLimit: quiz?.timeLimit ?? undefined,
      allowRetake: quiz?.allowRetake ?? true,
      maxAttempts: quiz?.maxAttempts ?? undefined,
      shuffleQuestions: quiz?.shuffleQuestions ?? false,
      lessonId: quiz?.lesson?.id ?? undefined,
      chapterId: quiz?.chapter?.id ?? undefined,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchLessonId = form.watch("lessonId");

  const watchChapterId = form.watch("chapterId");

  async function onSubmit(values: QuizFormValues) {
    const { error } = await tryCatch(
      isEditing ? updateQuiz(quiz.id, values) : createQuiz(values)
    );

    if (error) {
      toast.error(
        isEditing ? "Failed to update quiz" : "Failed to create quiz"
      );
      return;
    }

    toast.success(isEditing ? "Quiz updated" : "Quiz created");
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Quiz" : "Create Quiz"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update quiz settings and configuration."
              : "Add a new quiz to a lesson."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional quiz description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 rounded-lg border p-4">
              <div className="text-sm font-medium">Attach To (choose one)</div>
              <p className="text-muted-foreground text-xs">
                A quiz can be attached to either a lesson or a chapter, but not
                both.
              </p>

              <FormField
                control={form.control}
                name="lessonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value) {
                          form.setValue("chapterId", undefined);
                        }
                      }}
                      value={field.value ?? ""}
                      disabled={!!watchChapterId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a lesson" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lessons.map((lesson) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.chapter.course.title} →{" "}
                            {lesson.chapter.title} → {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <div className="bg-border h-px flex-1" />
                <span>OR</span>
                <div className="bg-border h-px flex-1" />
              </div>

              <FormField
                control={form.control}
                name="chapterId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chapter</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value) {
                          form.setValue("lessonId", undefined);
                        }
                      }}
                      value={field.value ?? ""}
                      disabled={!!watchLessonId}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a chapter" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {chapters.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.course.title} → {chapter.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Attach quiz to an entire chapter instead of a specific
                      lesson
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {(watchLessonId || watchChapterId) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    form.setValue("lessonId", undefined);
                    form.setValue("chapterId", undefined);
                  }}
                >
                  Clear selection
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="passingScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passing Score (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="No limit"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="allowRetake"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Allow Retakes</FormLabel>
                      <FormDescription>
                        Students can retry the quiz
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxAttempts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Attempts</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Unlimited"
                        {...field}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>Leave empty for unlimited</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="shuffleQuestions"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Shuffle Questions</FormLabel>
                    <FormDescription>
                      Randomize question order for each attempt
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <IconLoader2 className="mr-2 size-4 animate-spin" />
                )}
                {isEditing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
