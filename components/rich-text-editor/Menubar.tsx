"use client";

import { Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  ListIcon,
  ListOrderedIcon,
  Redo2Icon,
  Strikethrough,
  Undo2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

interface Menubar {
  editor: Editor | null;
}

export function Menubar({ editor }: Menubar) {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrike, setIsStrike] = useState(false);
  const [isH1, setIsH1] = useState(false);
  const [isH2, setIsH2] = useState(false);
  const [isH3, setIsH3] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [textAlign, setTextAlign] = useState<
    "left" | "center" | "right" | null
  >(null);

  useEffect(() => {
    if (!editor) return;

    const updateStates = () => {
      setIsBold(editor.isActive("bold"));
      setIsItalic(editor.isActive("italic"));
      setIsStrike(editor.isActive("strike"));
      setIsH1(editor.isActive("heading", { level: 1 }));
      setIsH2(editor.isActive("heading", { level: 2 }));
      setIsH3(editor.isActive("heading", { level: 3 }));
      setIsBulletList(editor.isActive("bulletList"));
      setIsOrderedList(editor.isActive("orderedList"));

      if (editor.isActive({ textAlign: "left" })) setTextAlign("left");
      else if (editor.isActive({ textAlign: "center" })) setTextAlign("center");
      else if (editor.isActive({ textAlign: "right" })) setTextAlign("right");
      else setTextAlign(null);
    };

    // Initial sync
    updateStates();

    // Update on selection changes
    editor.on("selectionUpdate", updateStates);
    editor.on("transaction", updateStates);

    return () => {
      editor.off("selectionUpdate", updateStates);
      editor.off("transaction", updateStates);
    };
  }, [editor]);

  if (!editor) {
    return null;
  }
  return (
    <TooltipProvider>
      <div className="border-input bg-card flex flex-wrap items-center gap-1 border-b p-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleBold().run();
                setIsBold(!isBold);
              }}
              className={cn(isBold && "bg-muted text-muted-foreground")}
            >
              <Bold />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleItalic().run();
                setIsItalic(!isItalic);
              }}
              className={cn(isItalic && "bg-muted text-muted-foreground")}
            >
              <Italic />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Italic</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleStrike().run();
                setIsStrike(!isStrike);
              }}
              className={cn(isStrike && "bg-muted text-muted-foreground")}
            >
              <Strikethrough />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Strike</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setIsH1(!isH1);
              }}
              className={cn(isH1 && "bg-muted text-muted-foreground")}
            >
              <Heading1Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 1</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setIsH2(!isH2);
              }}
              className={cn(isH2 && "bg-muted text-muted-foreground")}
            >
              <Heading2Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 2</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setIsH3(!isH3);
              }}
              className={cn(isH3 && "bg-muted text-muted-foreground")}
            >
              <Heading3Icon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Heading 3</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
                setIsBulletList(!isBulletList);
              }}
              className={cn(isBulletList && "bg-muted text-muted-foreground")}
            >
              <ListIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bullet List</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              type="button"
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                setIsOrderedList(!isOrderedList);
              }}
              className={cn(isOrderedList && "bg-muted text-muted-foreground")}
            >
              <ListOrderedIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ordered List</TooltipContent>
        </Tooltip>
        <div className="bg-border mx-2 h-6 w-px" />
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  editor.chain().focus().setTextAlign("left").run();
                  setTextAlign("left");
                }}
                className={cn(
                  textAlign === "left" && "bg-muted text-muted-foreground"
                )}
              >
                <AlignLeft />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  editor.chain().focus().setTextAlign("center").run();
                  setTextAlign("center");
                }}
                className={cn(
                  textAlign === "center" && "bg-muted text-muted-foreground"
                )}
              >
                <AlignCenter />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => {
                  editor.chain().focus().setTextAlign("right").run();
                  setTextAlign("right");
                }}
                className={cn(
                  textAlign === "right" && "bg-muted text-muted-foreground"
                )}
              >
                <AlignRight />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>
        </div>
        <div className="bg-border mx-2 h-6 w-px"></div>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo2Icon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
