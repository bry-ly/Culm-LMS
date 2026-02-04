"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Question {
  id: string;
  questionText: string;
  questionType:
    | "MultipleChoice"
    | "TrueFalse"
    | "MultiSelect"
    | "FillInBlank"
    | "Matching"
    | "ShortAnswer";
  options: unknown;
  points: number;
  position: number;
}

// Answer types for different question types:
// - MultipleChoice, TrueFalse: string
// - MultiSelect: string[]
// - FillInBlank: string[] (array of answers for each blank)
// - Matching: Record<string, string> (left -> right mappings)
// - ShortAnswer: string
type AnswerType = string | string[] | Record<string, string> | undefined;

interface QuestionCardProps {
  question: Question;
  answer: AnswerType;
  onAnswerChange: (answer: AnswerType) => void;
}

export function QuestionCard({
  question,
  answer,
  onAnswerChange,
}: QuestionCardProps) {
  const options = question.options as string[];

  // Parse matching pairs at the top level (not inside a render function)
  const matchingPairs = useMemo(() => {
    if (question.questionType !== "Matching") return [];
    try {
      return options.map(
        (opt) => JSON.parse(opt) as { left: string; right: string }
      );
    } catch {
      return [];
    }
  }, [question.questionType, options]);

  // Shuffle right items for matching (consistent per question)
  const shuffledRightItems = useMemo(() => {
    if (question.questionType !== "Matching") return [];
    const rightItems = matchingPairs.map((p) => p.right);
    // Use question.id as seed for consistent shuffle
    return [...rightItems].sort((a, b) => {
      const hash = (s: string) =>
        s.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return hash(a + question.id) - hash(b + question.id);
    });
  }, [question.questionType, question.id, matchingPairs]);

  const handleMultiSelectChange = (option: string, checked: boolean) => {
    const currentAnswers = Array.isArray(answer) ? answer : [];
    if (checked) {
      onAnswerChange([...currentAnswers, option]);
    } else {
      onAnswerChange(currentAnswers.filter((a) => a !== option));
    }
  };

  // For FillInBlank: Parse question text to find blanks (___) and render inline inputs
  const renderFillInBlank = () => {
    const parts = question.questionText.split(/(___)/g);
    let blankIndex = 0;
    const currentAnswers = Array.isArray(answer) ? answer : [];

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Fill in the blanks in the sentence below
        </p>
        <div className="flex flex-wrap items-center gap-1 text-base leading-relaxed">
          {parts.map((part, idx) => {
            if (part === "___") {
              const currentBlankIndex = blankIndex;
              blankIndex++;
              return (
                <Input
                  key={idx}
                  className="mx-1 inline-block w-32"
                  placeholder={`Blank ${currentBlankIndex + 1}`}
                  value={currentAnswers[currentBlankIndex] || ""}
                  onChange={(e) => {
                    const newAnswers = [...currentAnswers];
                    newAnswers[currentBlankIndex] = e.target.value;
                    onAnswerChange(newAnswers);
                  }}
                />
              );
            }
            return <span key={idx}>{part}</span>;
          })}
        </div>
      </div>
    );
  };

  // For Matching: render dropdown matching using pre-computed pairs
  const renderMatching = () => {
    const leftItems = matchingPairs.map((p) => p.left);

    const currentMatches = (
      typeof answer === "object" && !Array.isArray(answer) ? answer : {}
    ) as Record<string, string>;

    const handleMatchChange = (left: string, right: string) => {
      const newMatches = { ...currentMatches, [left]: right };
      onAnswerChange(newMatches);
    };

    // Get available right options (not yet selected by other items)
    const getAvailableRightOptions = (currentLeft: string) => {
      const usedRights = Object.entries(currentMatches)
        .filter(([left]) => left !== currentLeft)
        .map(([, right]) => right);
      return shuffledRightItems.filter((r) => !usedRights.includes(r));
    };

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Match each item on the left with the correct item on the right
        </p>
        <div className="space-y-3">
          {leftItems.map((left, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="bg-muted flex-1 rounded-md p-3 text-sm">
                {left}
              </div>
              <span className="text-muted-foreground">→</span>
              <Select
                value={currentMatches[left] || ""}
                onValueChange={(value) => handleMatchChange(left, value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select match..." />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableRightOptions(left).map((right, ridx) => (
                    <SelectItem key={ridx} value={right}>
                      {right}
                    </SelectItem>
                  ))}
                  {currentMatches[left] && (
                    <SelectItem value={currentMatches[left]}>
                      {currentMatches[left]}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // For ShortAnswer: Simple textarea input
  const renderShortAnswer = () => {
    const currentAnswer = typeof answer === "string" ? answer : "";

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Write your answer in the box below
        </p>
        <Textarea
          placeholder="Type your answer here..."
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg leading-relaxed font-medium">
            {question.questionType === "FillInBlank"
              ? "Fill in the Blanks"
              : question.questionText}
          </CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {question.points} {question.points === 1 ? "point" : "points"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {question.questionType === "MultipleChoice" && (
          <RadioGroup
            value={typeof answer === "string" ? answer : ""}
            onValueChange={onAnswerChange}
            className="space-y-3"
          >
            {options.map((option, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <RadioGroupItem value={option} id={`option-${idx}`} />
                <Label
                  htmlFor={`option-${idx}`}
                  className="cursor-pointer text-base"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {question.questionType === "TrueFalse" && (
          <RadioGroup
            value={typeof answer === "string" ? answer : ""}
            onValueChange={onAnswerChange}
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="True" id="option-true" />
              <Label htmlFor="option-true" className="cursor-pointer text-base">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="False" id="option-false" />
              <Label
                htmlFor="option-false"
                className="cursor-pointer text-base"
              >
                False
              </Label>
            </div>
          </RadioGroup>
        )}

        {question.questionType === "MultiSelect" && (
          <div className="space-y-3">
            <p className="text-muted-foreground mb-2 text-sm">
              Select all that apply
            </p>
            {options.map((option, idx) => {
              const currentAnswers = Array.isArray(answer) ? answer : [];
              const isChecked = currentAnswers.includes(option);
              return (
                <div key={idx} className="flex items-center space-x-3">
                  <Checkbox
                    id={`option-${idx}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleMultiSelectChange(option, checked === true)
                    }
                  />
                  <Label
                    htmlFor={`option-${idx}`}
                    className="cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              );
            })}
          </div>
        )}

        {question.questionType === "FillInBlank" && renderFillInBlank()}

        {question.questionType === "Matching" && renderMatching()}

        {question.questionType === "ShortAnswer" && renderShortAnswer()}
      </CardContent>
    </Card>
  );
}
