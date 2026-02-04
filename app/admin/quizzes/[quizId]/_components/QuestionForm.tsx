"use client";

import { useTransition, useState, useEffect } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { questionSchema, QuestionFormValues } from "@/lib/zodSchemas";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { createQuestion, updateQuestion } from "../actions";
import { AdminQuizDetailType } from "@/app/data/admin/admin-get-quiz";
import { IconPlus, IconTrash } from "@tabler/icons-react";

type Question = AdminQuizDetailType["questions"][number];

interface QuestionFormProps {
  quizId: string;
  question?: Question;
  onSuccess: () => void;
}

export function QuestionForm({
  quizId,
  question,
  onSuccess,
}: QuestionFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!question;

  const defaultOptions = question?.options
    ? (question.options as string[])
    : ["", ""];

  const defaultCorrectAnswer = question?.correctAnswer
    ? (question.correctAnswer as string | string[])
    : "";

  // For Matching type, options are stored as JSON strings of {left, right} pairs
  const getDefaultMatchingPairs = () => {
    if (question?.questionType === "Matching" && question?.options) {
      try {
        return (question.options as string[]).map((opt) => JSON.parse(opt));
      } catch {
        return [{ left: "", right: "" }];
      }
    }
    return [{ left: "", right: "" }];
  };

  const [matchingPairs, setMatchingPairs] = useState<
    { left: string; right: string }[]
  >(getDefaultMatchingPairs);

  // For FillInBlank, correctAnswer is array of blank answers
  const getDefaultBlankAnswers = () => {
    if (question?.questionType === "FillInBlank" && question?.correctAnswer) {
      return question.correctAnswer as string[];
    }
    return [""];
  };

  const [blankAnswers, setBlankAnswers] = useState<string[]>(
    getDefaultBlankAnswers
  );

  // For ShortAnswer, options contains keywords for auto-grading
  const getDefaultKeywords = () => {
    if (question?.questionType === "ShortAnswer" && question?.options) {
      return question.options as string[];
    }
    return [];
  };

  const [keywords, setKeywords] = useState<string[]>(getDefaultKeywords);
  const [newKeyword, setNewKeyword] = useState("");

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema) as Resolver<QuestionFormValues>,
    defaultValues: {
      questionText: question?.questionText ?? "",
      questionType: question?.questionType ?? "MultipleChoice",
      options: defaultOptions,
      correctAnswer: defaultCorrectAnswer,
      explanation: question?.explanation ?? "",
      points: question?.points ?? 1,
      quizId,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const questionType = form.watch("questionType");

  const options = form.watch("options");

  useEffect(() => {
    if (questionType === "TrueFalse") {
      form.setValue("options", ["True", "False"]);
      if (
        !["True", "False"].includes(form.getValues("correctAnswer") as string)
      ) {
        form.setValue("correctAnswer", "True");
      }
    } else if (questionType === "FillInBlank") {
      // Options not used for FillInBlank, correctAnswer is array of blank answers
      form.setValue("options", []);
      if (!isEditing) {
        form.setValue("correctAnswer", []);
      }
    } else if (questionType === "Matching") {
      // Options store the pairs as JSON strings
      if (!isEditing) {
        setMatchingPairs([{ left: "", right: "" }]);
        form.setValue("options", []);
        form.setValue("correctAnswer", "");
      }
    } else if (questionType === "ShortAnswer") {
      // Options store keywords, correctAnswer is the expected answer
      if (!isEditing) {
        setKeywords([]);
        form.setValue("options", []);
        form.setValue("correctAnswer", "");
      }
    } else if (!isEditing && options.length < 2) {
      form.setValue("options", ["", ""]);
      form.setValue("correctAnswer", questionType === "MultiSelect" ? [] : "");
    }
  }, [questionType, form, isEditing, options.length]);

  function addOption() {
    const currentOptions = form.getValues("options");
    form.setValue("options", [...currentOptions, ""]);
  }

  function removeOption(index: number) {
    const currentOptions = form.getValues("options");
    if (currentOptions.length <= 2) return;
    const newOptions = currentOptions.filter((_, i) => i !== index);
    form.setValue("options", newOptions);

    const currentAnswer = form.getValues("correctAnswer");
    const removedOption = currentOptions[index];

    if (Array.isArray(currentAnswer)) {
      form.setValue(
        "correctAnswer",
        currentAnswer.filter((a) => a !== removedOption)
      );
    } else if (currentAnswer === removedOption) {
      form.setValue("correctAnswer", "");
    }
  }

  function onSubmit(values: QuestionFormValues) {
    startTransition(async () => {
      // Prepare values based on question type
      const finalValues = { ...values };

      if (values.questionType === "FillInBlank") {
        finalValues.options = [];
        finalValues.correctAnswer = blankAnswers.filter((a) => a.trim() !== "");
      } else if (values.questionType === "Matching") {
        // Store pairs as JSON strings in options
        finalValues.options = matchingPairs
          .filter((p) => p.left.trim() && p.right.trim())
          .map((p) => JSON.stringify(p));
        // Store correct mapping as JSON object
        const correctMapping: Record<string, string> = {};
        matchingPairs
          .filter((p) => p.left.trim() && p.right.trim())
          .forEach((p) => {
            correctMapping[p.left] = p.right;
          });
        finalValues.correctAnswer = JSON.stringify(correctMapping);
      } else if (values.questionType === "ShortAnswer") {
        finalValues.options = keywords;
        // correctAnswer is already set via the form field
      }

      const action = isEditing
        ? updateQuestion(question.id, finalValues)
        : createQuestion(finalValues);

      const { data, error } = await tryCatch(action);

      if (error || data?.status === "error") {
        toast.error(data?.message ?? "Something went wrong");
        return;
      }

      toast.success(data.message);
      onSuccess();
    });
  }

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Question" : "Add Question"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Update the question details below."
            : "Fill in the question details below."}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="questionText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your question..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="questionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MultipleChoice">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="TrueFalse">True/False</SelectItem>
                      <SelectItem value="MultiSelect">Multi Select</SelectItem>
                      <SelectItem value="FillInBlank">
                        Fill in the Blank
                      </SelectItem>
                      <SelectItem value="Matching">Matching</SelectItem>
                      <SelectItem value="ShortAnswer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Options section - only for MultipleChoice, TrueFalse, MultiSelect */}
          {(questionType === "MultipleChoice" ||
            questionType === "MultiSelect") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Options</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addOption}
                >
                  <IconPlus className="mr-1 size-4" />
                  Add Option
                </Button>
              </div>
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...options];
                      const oldValue = newOptions[index];
                      newOptions[index] = e.target.value;
                      form.setValue("options", newOptions);

                      const currentAnswer = form.getValues("correctAnswer");
                      if (Array.isArray(currentAnswer)) {
                        form.setValue(
                          "correctAnswer",
                          currentAnswer.map((a) =>
                            a === oldValue ? e.target.value : a
                          )
                        );
                      } else if (currentAnswer === oldValue) {
                        form.setValue("correctAnswer", e.target.value);
                      }
                    }}
                  />
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeOption(index)}
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Fill in the Blank section */}
          {questionType === "FillInBlank" && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="text-muted-foreground text-sm">
                  Use <code className="bg-background rounded px-1">___</code>{" "}
                  (three underscores) in your question text to indicate blanks.
                  Then provide the correct answer for each blank below.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label>Blank Answers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setBlankAnswers([...blankAnswers, ""])}
                >
                  <IconPlus className="mr-1 size-4" />
                  Add Blank
                </Button>
              </div>
              {blankAnswers.map((answer, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-muted-foreground w-16 text-sm">
                    Blank {index + 1}:
                  </span>
                  <Input
                    placeholder={`Answer for blank ${index + 1}`}
                    value={answer}
                    onChange={(e) => {
                      const newAnswers = [...blankAnswers];
                      newAnswers[index] = e.target.value;
                      setBlankAnswers(newAnswers);
                    }}
                  />
                  {blankAnswers.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setBlankAnswers(
                          blankAnswers.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Matching section */}
          {questionType === "Matching" && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg border p-3">
                <p className="text-muted-foreground text-sm">
                  Create pairs that students will need to match. The left side
                  contains terms/prompts, the right side contains their matches.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label>Matching Pairs</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setMatchingPairs([
                      ...matchingPairs,
                      { left: "", right: "" },
                    ])
                  }
                >
                  <IconPlus className="mr-1 size-4" />
                  Add Pair
                </Button>
              </div>
              {matchingPairs.map((pair, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Term / Prompt"
                    value={pair.left}
                    onChange={(e) => {
                      const newPairs = [...matchingPairs];
                      newPairs[index] = { ...pair, left: e.target.value };
                      setMatchingPairs(newPairs);
                    }}
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">→</span>
                  <Input
                    placeholder="Match / Definition"
                    value={pair.right}
                    onChange={(e) => {
                      const newPairs = [...matchingPairs];
                      newPairs[index] = { ...pair, right: e.target.value };
                      setMatchingPairs(newPairs);
                    }}
                    className="flex-1"
                  />
                  {matchingPairs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setMatchingPairs(
                          matchingPairs.filter((_, i) => i !== index)
                        )
                      }
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Short Answer section */}
          {questionType === "ShortAnswer" && (
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="correctAnswer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Answer</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the expected answer..."
                        value={field.value as string}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="bg-muted/50 rounded-lg border p-3">
                  <p className="text-muted-foreground text-sm">
                    Optional: Add keywords for auto-grading. If the
                    student&apos;s answer contains these keywords, it may
                    receive partial or full credit.
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Keywords (Optional)</Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (newKeyword.trim()) {
                          setKeywords([...keywords, newKeyword.trim()]);
                          setNewKeyword("");
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newKeyword.trim()) {
                        setKeywords([...keywords, newKeyword.trim()]);
                        setNewKeyword("");
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <div
                        key={index}
                        className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                      >
                        <span>{keyword}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setKeywords(keywords.filter((_, i) => i !== index))
                          }
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Correct Answer section - for MultipleChoice, TrueFalse, MultiSelect */}
          {(questionType === "MultipleChoice" ||
            questionType === "TrueFalse" ||
            questionType === "MultiSelect") && (
            <FormField
              control={form.control}
              name="correctAnswer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correct Answer</FormLabel>
                  <FormControl>
                    {questionType === "MultiSelect" ? (
                      <div className="space-y-2">
                        {options
                          .filter((opt) => opt.trim() !== "")
                          .map((option, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                id={`correct-${index}`}
                                checked={(field.value as string[])?.includes(
                                  option
                                )}
                                onCheckedChange={(checked) => {
                                  const current =
                                    (field.value as string[]) || [];
                                  if (checked) {
                                    field.onChange([...current, option]);
                                  } else {
                                    field.onChange(
                                      current.filter((v) => v !== option)
                                    );
                                  }
                                }}
                              />
                              <Label htmlFor={`correct-${index}`}>
                                {option}
                              </Label>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value as string}
                        className="space-y-2"
                      >
                        {(questionType === "TrueFalse"
                          ? ["True", "False"]
                          : options.filter((opt) => opt.trim() !== "")
                        ).map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <RadioGroupItem
                              value={option}
                              id={`answer-${index}`}
                            />
                            <Label htmlFor={`answer-${index}`}>{option}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Explanation (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Explain why this is the correct answer..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
