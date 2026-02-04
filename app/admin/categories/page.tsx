import { Suspense } from "react";
import { IconPlus } from "@tabler/icons-react";

import { adminGetCategories } from "@/app/data/admin/admin-get-categories";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoriesTable } from "./_components/CategoriesTable";
import { CategoryFormWrapper } from "./_components/CategoryFormWrapper";

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage course categories to organize your content.
          </p>
        </div>
        <CategoryFormWrapper>
          <Button>
            <IconPlus className="mr-2 size-4" />
            Add Category
          </Button>
        </CategoryFormWrapper>
      </div>
      <Suspense fallback={<CategoriesTableSkeleton />}>
        <CategoriesTableLoader />
      </Suspense>
    </div>
  );
}

async function CategoriesTableLoader() {
  const categories = await adminGetCategories();
  return <CategoriesTable categories={categories} />;
}

function CategoriesTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="p-4">
        <Skeleton className="h-8 w-full" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="border-t p-4">
          <Skeleton className="h-6 w-full" />
        </div>
      ))}
    </div>
  );
}
