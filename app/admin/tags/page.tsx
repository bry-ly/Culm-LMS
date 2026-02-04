import { Suspense } from "react";

import { adminGetTags } from "@/app/data/admin/admin-get-tags";
import { TagsTable } from "./_components/TagsTable";
import { TagFormWrapper } from "./_components/TagFormWrapper";

export default function TagsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Manage tags to label and filter your courses.
          </p>
        </div>
        <TagFormWrapper />
      </div>
      <Suspense fallback={<TagsTableSkeleton />}>
        <TagsContent />
      </Suspense>
    </div>
  );
}

async function TagsContent() {
  const tags = await adminGetTags();
  return <TagsTable tags={tags} />;
}

function TagsTableSkeleton() {
  return (
    <div className="rounded-md border">
      <div className="bg-muted h-[400px] animate-pulse" />
    </div>
  );
}
