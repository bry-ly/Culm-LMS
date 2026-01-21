import { getIndividualCourse } from "@/app/data/course/get-course";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { env } from "@/lib/env";
import {
  IconBook,
  IconCategory2,
  IconChartBar,
  IconCheck,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { ClockIcon } from "lucide-react";
import Image from "next/image";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import Link from "next/link";
import { EnrollmentButton } from "./_components/EnrollmentButton";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  const isEnrolled = await checkIfCourseBought(course.id);
  return (
    <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.filekey}`}
            alt="Thumbail"
            fill
            className="object-cover"
            priority
          />
          <div className="from-primary/10 absolute inset-0 bg-linear-to-t to-transparent"></div>
        </div>
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-muted-foreground line-clam-2 text-lg leading-relaxed">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconCategory2 className="size-4" />
              <span>{course.category}</span>
            </Badge>
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
          </div>
          <Separator className="my-8" />
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Description
            </h2>
            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Content
            </h2>
            <div>
              {course.chapter.length} Chapters |{" "}
              {course.chapter.reduce(
                (total, chapter) => total + chapter.lesson.length,
                0
              ) || 0}{" "}
              Lessons
            </div>
          </div>
          <div className="space-y-4">
            {course.chapter.map((chapter, index) => (
              <Collapsible key={chapter.id} defaultOpen={index === 0}>
                <Card className="gap-0 overflow-hidden border-2 p-0 transition-all duration-200 hover:shadow-md">
                  <CollapsibleTrigger>
                    <div className="">
                      <CardContent className="hover:bg-muted/50 transition-color p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <p className="bg-primary/10 text-primary fonfont-semibold flex size-10 items-center justify-center rounded-full">
                              {index + 1}
                            </p>
                            <div>
                              <h3 className="text-left text-xl font-semibold">
                                {chapter.title}
                              </h3>
                              <p className="text-muted-foreground mt-1 text-sm">
                                {chapter.lesson.length} Lesson
                                {chapter.lesson.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {chapter.lesson.length} Lesson
                              {chapter.lesson.length !== 1 ? "s" : ""}
                            </Badge>
                            <IconChevronDown className="text-muted-foreground size-5" />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="bg-muted/20 border-t">
                      <div className="space-y-3 p-6 pt-4">
                        {chapter.lesson.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="hover:bg-accent group flex items-center gap-4 rounded-lg p-3 transition-colors"
                          >
                            <div className="bg-background border-primary/20 flex size-8 items-center justify-center rounded-full border-2">
                              <IconPlayerPlay className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">
                                {lesson.title}
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                Lesson {index + 1}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
      {/* Enrollment Card*/}
      <div className="lg:col-span1 order-2">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-lg font-medium">Price:</span>
                <span className="text-primary text-2xl font-bold">
                  {course.isFree ? (
                    <span className="text-green-500">Free</span>
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "PHP",
                    }).format(course.price)
                  )}
                </span>
              </div>
              <div className="bg-muted mb-6 space-y-3 rounded-lg p-4">
                <h4 className="font-medium">What will you get</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <ClockIcon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Duration</p>
                      <p className="text-muted-foreground text-sm">
                        {course.duration} hours
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <IconChartBar className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Difficulty Level</p>
                      <p className="text-muted-foreground text-sm">
                        {course.level}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <IconCategory2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-muted-foreground text-sm">
                        {course.category}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
                      <IconBook className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Lessons</p>
                      <p className="text-muted-foreground text-sm">
                        {course.chapter.reduce(
                          (total, chapter) => total + chapter.lesson.length,
                          0
                        ) || 0}{" "}
                        Lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-3">
                <h4>This course include:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-1">
                    <div className="rounded-full bg-green-500/80 p-1">
                      <IconCheck className="size-4" />
                    </div>
                    <span className="">Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="rounded-full bg-green-500/80 p-1">
                      <IconCheck className="size-4" />
                    </div>
                    <span className="">Access on Mobile and Desktop</span>
                  </li>
                  <li className="flex items-center gap-1">
                    <div className="rounded-full bg-green-500/80 p-1">
                      <IconCheck className="size-4" />
                    </div>
                    <span className="">Certificate of completion</span>
                  </li>
                </ul>
              </div>
              {isEnrolled ? (
                <Link
                  href="/dashboard"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full",
                  })}
                >
                  <IconPlayerPlay className="size-4" />
                  Watch Course
                </Link>
              ) : (
                <EnrollmentButton courseId={course.id} isFree={course.isFree} />
              )}
              <p className="text-muted-foreground mt-3 text-center text-xs">
                30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
