"use client";

import { useState, useTransition, ReactNode, useMemo, useEffect } from "react";
import {
  DndContext,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { tryCatch } from "@/hooks/try-catch";
import { AdminQuizDetailType } from "@/app/data/admin/admin-get-quiz";
import {
  IconDots,
  IconEdit,
  IconTrash,
  IconGripVertical,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { deleteQuestion, reorderQuestions } from "../actions";
import { QuestionFormWrapper } from "./QuestionFormWrapper";

type Question = AdminQuizDetailType["questions"][number];

interface QuestionsTableProps {
  questions: Question[];
  quizId: string;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
}

function SortableItem({ children, className, id }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        "touch-none",
        className,
        isDragging ? "z-10 opacity-50" : ""
      )}
    >
      {children(listeners)}
    </div>
  );
}

export function QuestionsTable({ questions, quizId }: QuestionsTableProps) {
  const [isPending, startTransition] = useTransition();

  const initialItems = useMemo(
    () =>
      questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        points: q.points,
        options: q.options as string[],
        position: q.position,
      })),
    [questions]
  );

  const [items, setItems] = useState(initialItems);

  const serializedQuestions = JSON.stringify(
    questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      position: q.position,
    }))
  );

  useEffect(() => {
    setItems(
      questions.map((q) => ({
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        points: q.points,
        options: q.options as string[],
        position: q.position,
      }))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedQuestions]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      toast.error("Could not find question for reordering");
      return;
    }

    const reorderedItems = arrayMove(items, oldIndex, newIndex);
    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      position: index + 1,
    }));

    const previousItems = [...items];
    setItems(updatedItems);

    const questionsToUpdate = updatedItems.map((item) => ({
      id: item.id,
      position: item.position,
    }));

    const reorderPromise = () => reorderQuestions(quizId, questionsToUpdate);

    toast.promise(reorderPromise(), {
      loading: "Reordering questions...",
      success: (result) => {
        if (result.status === "success") return result.message;
        throw new Error(result.message);
      },
      error: () => {
        setItems(previousItems);
        return "Failed to reorder questions";
      },
    });
  }

  function handleDelete(questionId: string) {
    startTransition(async () => {
      const { data, error } = await tryCatch(
        deleteQuestion(questionId, quizId)
      );
      if (error || data?.status === "error") {
        toast.error(data?.message ?? "Failed to delete question");
        return;
      }
      toast.success(data.message);
    });
  }

  function getQuestionTypeBadge(type: string) {
    switch (type) {
      case "MultipleChoice":
        return <Badge variant="outline">Multiple Choice</Badge>;
      case "TrueFalse":
        return <Badge variant="secondary">True/False</Badge>;
      case "MultiSelect":
        return <Badge>Multi Select</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h3 className="text-lg font-medium">No questions yet</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Add your first question to this quiz.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((item, index) => {
            const originalQuestion = questions.find((q) => q.id === item.id);

            return (
              <SortableItem key={item.id} id={item.id}>
                {(listeners) => (
                  <div className="bg-card hover:bg-accent/50 flex items-center gap-4 rounded-lg border p-4 transition-colors">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-grab opacity-60 hover:opacity-100"
                      {...listeners}
                    >
                      <IconGripVertical className="size-4" />
                    </Button>

                    <div className="text-muted-foreground w-8 text-center text-sm font-medium">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {item.questionText}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        {getQuestionTypeBadge(item.questionType)}
                        <span className="text-muted-foreground text-xs">
                          {item.points} {item.points === 1 ? "point" : "points"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {item.options.length} options
                        </span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8"
                          disabled={isPending}
                        >
                          <IconDots className="size-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {originalQuestion && (
                          <QuestionFormWrapper
                            quizId={quizId}
                            question={originalQuestion}
                          >
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                            >
                              <IconEdit className="mr-2 size-4" />
                              Edit Question
                            </DropdownMenuItem>
                          </QuestionFormWrapper>
                        )}
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive"
                            >
                              <IconTrash className="mr-2 size-4" />
                              Delete Question
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Question?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this question. This
                                action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(item.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </SortableItem>
            );
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
}
