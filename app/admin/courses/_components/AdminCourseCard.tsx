"use client";

import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Edit,
  Eye,
  MoreVertical,
  School,
  TimerIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DeleteCourseModal } from "./DeleteCourseModal";

interface Course {
  data: AdminCourseType;
}

export function AdminCourseCard({ data }: Course) {
  const thumbnailUrl = useConstructUrl(data.filekey);
  return (
    <Card className="group bg-pattern-striped relative gap-0 py-0">
      {/*Absolute dropdown*/}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Edit className="mr-2 size-4" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <Eye className="mr-2 size-4" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteCourseModal courseId={data.id} courseTitle={data.title} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail Url"
        width={600}
        height={400}
        className="aspect-video h-full w-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
        >
          {data.title}
        </Link>
        <p className="text-muted-foreground line-clamp-2 text-sm leading-tight">
          {data.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-2">
            <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-sm">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-2">
            <School className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-sm">{data.level}</p>
          </div>
        </div>
        <Link
          className={buttonVariants({
            className: "mt-4 w-full",
          })}
          href={`/admin/courses/${data.id}/edit`}
        >
          Edit Course <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function AdminCoursesCardSekeleton() {
  return (
    <Card className="group relative gap-0 py-0">
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />

        <Skeleton className="size-8 rounded-md" />
      </div>
      <div className="relative h-fit w-full">
        <Skeleton className="aspect-video h-62.5 w-full rounded-t-lg object-cover" />
      </div>
      <CardContent className="p-4">
        <Skeleton className="mb-2 h-6 w-3/4 rounded" />
        <Skeleton className="mb-4 h-4 w-full rounded" />
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded" />
      </CardContent>
    </Card>
  );
}
