"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShimmeringText } from "@/components/ui/shimmering-text";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import Link from "next/link";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { Progress } from "@/components/ui/progress";

interface iAppProps {
  data: EnrolledCourseType;
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

export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.course.filekey);
  const { progressPercentage, totalLessons, completedLessons } = useCourseProgress({ courseData: data.course });

  return (
    <Card className="group relative py-0 gap-0 hover:shadow-xl hover:border-primary transition-all duration-300">
      <div className="absolute top-2 right-2 z-10">
        <div className="backdrop-blur-md bg-white/20 border border-white/30 dark:bg-black/30 dark:border-white/10 rounded-md px-3 py-1.5 shadow-sm">
          <ShimmeringText
            text={data.course.level}
            duration={1}
            isStopped={false}
            className="text-xs font-semibold uppercase"
            style={
              {
                "--color": getLevelShimmerColors(data.course.level).baseColor,
                "--shimmering-color": getLevelShimmerColors(data.course.level).shimmeringColor,
              } as React.CSSProperties
            }
          />
        </div>
      </div>
      <Image src={thumbnailUrl} alt="Thumbnail" width={600} height={400} className="w-full rounded-t-xl aspect-video h-full object-cover" />
      <CardContent className="p-4">
        <Link className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors" href={`/courses/${data.course.slug}`}>
          {data.course.title}
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2 ">{data.course.smallDescription}</p>
        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm ">
            <span>Progress:</span>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons}
          </p>
        </div>
        <Link
          href={`/dashboard/${data.course.slug}`}
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
