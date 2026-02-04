"use client";

import { useState, useTransition } from "react";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { AdminTagType } from "@/app/data/admin/admin-get-tags";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tryCatch } from "@/hooks/try-catch";
import { deleteTag } from "../actions";
import { TagForm } from "./TagForm";

interface TagsTableProps {
  tags: AdminTagType[];
}

export function TagsTable({ tags }: TagsTableProps) {
  const [editingTag, setEditingTag] = useState<AdminTagType | null>(null);
  const [deletingTag, setDeletingTag] = useState<AdminTagType | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!deletingTag) return;

    startTransition(async () => {
      const { data, error } = await tryCatch(deleteTag(deletingTag.id));

      if (error) {
        toast.error("Something went wrong. Please try again.");
        setDeletingTag(null);
        return;
      }

      if (data.status === "error") {
        toast.error(data.message);
        setDeletingTag(null);
        return;
      }

      toast.success(data.message);
      setDeletingTag(null);
    });
  }

  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No tags found.</p>
        <p className="text-muted-foreground text-sm">
          Create your first tag to label courses.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-center">Courses</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{tag.slug}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{tag._count.courses}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8">
                        <IconDotsVertical className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTag(tag)}>
                        <IconPencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingTag(tag)}
                        className="text-destructive focus:text-destructive"
                      >
                        <IconTrash className="mr-2 size-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TagForm
        open={!!editingTag}
        onOpenChange={(open) => !open && setEditingTag(null)}
        tag={editingTag}
      />

      <AlertDialog
        open={!!deletingTag}
        onOpenChange={(open) => !open && setDeletingTag(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingTag?.name}
              &quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
