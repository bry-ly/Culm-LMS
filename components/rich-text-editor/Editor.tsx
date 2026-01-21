"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";
import { CornerBorders } from "../ui/corner-borders";

type RichTextField = {
  value: string | null | undefined;
  onChange: (value: string) => void;
};

export function RichTextEditor({ field }: { field: RichTextField }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    immediatelyRender: false,

    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none ",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<p></p>",
  });

  return (
    <div className="border-input dark:bg-input/30 relative w-full overflow-hidden rounded-none border">
      <CornerBorders />
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
