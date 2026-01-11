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
    <Card className="group relative py-0 gap-0 hover:shadow-xl hover:border-primary transition-all duration-300 bg-pattern-stripe">
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        {data.isFree && (
          <Badge variant="secondary" className="bg-green-500/90 text-white border-0 font-semibold">
            Free
          </Badge>
        )}
        <div className="backdrop-blur-md bg-white/20 border border-white/30 dark:bg-black/30 dark:border-white/10 rounded-md px-3 py-1.5 shadow-sm">
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
        className="w-full aspect-video h-full object-cover"
      />
      <CardContent className="p-4">
        <Link
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
          href={`/courses/${data.slug}`}
        >
          {data.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2 ">
          {data.smallDescription}
        </p>
        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2 ">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>
          <div className="flex items-center gap-x-2 ">
            <SchoolIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">{data.category}</p>
          </div>
        </div>
        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
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
    <Card className="group relative py-0 gap-0">
      <div className="absolute top-2 right-2 z-10">
        <div className="backdrop-blur-md bg-white/20 border border-white/30 dark:bg-black/30 dark:border-white/10 rounded-full px-3 py-1.5 shadow-sm">
          <Skeleton className="h-4 w-16 rounded-full" />
        </div>
      </div>
      <div className="w-full relative h-fit">
        <Skeleton className="w-full rounded-t-xl aspect-video" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-2 ">
          <Skeleton className="h-6 w-full " />
          <Skeleton className="h-6 w-3/4 " />
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
        <Skeleton className="mt-4 w-full h-10 rounded-md" />
      </CardContent>
    </Card>
  );
}
