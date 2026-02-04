import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { SchoolIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCourseType;
}

const getLevelShimmerColors = (level: string) => {
  const levelLower = level.toLowerCase();

  switch (levelLower) {
    case "beginner":
      return {
        baseColor: "#059669",
        shimmeringColor: "#34d399",
      };
    case "intermediate":
      return {
        baseColor: "#2563eb",
        shimmeringColor: "#60a5fa",
      };
    case "advanced":
      return {
        baseColor: "#7c3aed",
        shimmeringColor: "#a78bfa",
      };
    default:
      return {
        baseColor: "#4b5563",
        shimmeringColor: "#9ca3af",
      };
  }
};

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.filekey);

  return (
    <Card className="group hover:border-primary bg-pattern-stripe relative gap-0 py-0 transition-all duration-300 hover:shadow-xl">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {data.isFree && (
          <Badge
            variant="secondary"
            className="border-0 bg-green-500/90 font-semibold text-white"
          >
            Free
          </Badge>
        )}
        <div className="rounded-md border border-white/30 bg-white/20 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/30">
          <ShimmeringText
            text={data.level}
            duration={1}
            isStopped={false}
            className="text-xs font-semibold uppercase"
            style={
              {
                "--color": getLevelShimmerColors(data.level).baseColor,
                "--shimmering-color": getLevelShimmerColors(data.level)
                  .shimmeringColor,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail"
        width={600}
        height={400}
        className="aspect-video h-full w-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          className="group-hover:text-primary line-clamp-2 text-lg font-medium transition-colors hover:underline"
          href={`/courses/${data.slug}`}
        >
          {data.title}
        </Link>
        <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-tight">
          {data.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2">
            <SchoolIcon className="text-primary bg-primary/10 size-6 rounded-md p-1" />
            <p className="text-muted-foreground text-sm">
              {data.category?.name ?? "Uncategorized"}
            </p>
          </div>
        </div>
        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({
            className: "mt-4 w-full",
          })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 py-0">
      <div className="absolute top-2 right-2 z-10">
        <div className="rounded-full border border-white/30 bg-white/20 px-3 py-1.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/30">
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
      <div className="relative h-fit w-full">
        <Skeleton className="aspect-video w-full rounded-t-xl" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
}
