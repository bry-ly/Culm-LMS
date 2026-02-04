"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SparkleIcon } from "lucide-react";
import slugify from "slugify";
import { toast } from "sonner";

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
import { tryCatch } from "@/hooks/try-catch";
import { tagSchema, TagSchemaType } from "@/lib/zodSchemas";
import { createTag, updateTag } from "../actions";
import { AdminTagType } from "@/app/data/admin/admin-get-tags";

interface TagFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tag?: AdminTagType | null;
}

export function TagForm({ open, onOpenChange, tag }: TagFormProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!tag;

  const form = useForm<TagSchemaType>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: tag?.name ?? "",
      slug: tag?.slug ?? "",
    },
  });

  function onSubmit(values: TagSchemaType) {
    startTransition(async () => {
      const action = isEditing ? updateTag(tag.id, values) : createTag(values);

      const { data, error } = await tryCatch(action);

      if (error) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      if (data.status === "error") {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      form.reset();
      onOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Tag" : "Create Tag"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the tag details below."
              : "Add a new tag to label your courses."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="JavaScript" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Input placeholder="javascript" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => {
                        const nameValue = form.getValues("name");
                        const slug = slugify(nameValue, { lower: true });
                        form.setValue("slug", slug, { shouldValidate: true });
                      }}
                    >
                      Generate Slug <SparkleIcon className="ml-1" size={16} />
                    </Button>
                  </div>
                  <FormDescription>
                    URL-friendly identifier (lowercase, hyphens only)
                  </FormDescription>
                  <FormMessage />
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
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
