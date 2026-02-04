"use client";

import { useState, useTransition } from "react";
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { AdminCategoryType } from "@/app/data/admin/admin-get-categories";
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
import { deleteCategory } from "../actions";
import { CategoryForm } from "./CategoryForm";

interface CategoriesTableProps {
  categories: AdminCategoryType[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryType | null>(null);
  const [deletingCategory, setDeletingCategory] =
    useState<AdminCategoryType | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!deletingCategory) return;

    startTransition(async () => {
      const { data, error } = await tryCatch(
        deleteCategory(deletingCategory.id)
      );

      if (error) {
        toast.error("Something went wrong. Please try again.");
        setDeletingCategory(null);
        return;
      }

      if (data.status === "error") {
        toast.error(data.message);
        setDeletingCategory(null);
        return;
      }

      toast.success(data.message);
      setDeletingCategory(null);
    });
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">No categories found.</p>
        <p className="text-muted-foreground text-sm">
          Create your first category to organize courses.
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
              <TableHead>Description</TableHead>
              <TableHead className="text-center">Position</TableHead>
              <TableHead className="text-center">Courses</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{category.slug}</Badge>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {category.description || "-"}
                </TableCell>
                <TableCell className="text-center">
                  {category.position}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="outline">{category._count.courses}</Badge>
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
                      <DropdownMenuItem
                        onClick={() => setEditingCategory(category)}
                      >
                        <IconPencil className="mr-2 size-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeletingCategory(category)}
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

      <CategoryForm
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        category={editingCategory}
      />

      <AlertDialog
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deletingCategory?.name}
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
