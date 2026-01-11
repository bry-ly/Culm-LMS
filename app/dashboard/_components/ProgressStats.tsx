"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { BookOpen, CheckCircle2, Clock, Trophy } from "lucide-react";

interface ProgressStatsProps {
  enrolledCourses: EnrolledCourseType[];
}

export function ProgressStats({ enrolledCourses }: ProgressStatsProps) {
  // Calculate overall stats
  let totalLessons = 0;
  let completedLessons = 0;
  let completedCourses = 0;
  let totalDuration = 0;

  enrolledCourses.forEach((enrollment) => {
    const course = enrollment.course;
    totalDuration += course.duration;

    let courseTotalLessons = 0;
    let courseCompletedLessons = 0;

    course.chapter.forEach((chapter) => {
      chapter.lesson.forEach((lesson) => {
        courseTotalLessons++;
        totalLessons++;

        const isCompleted = lesson.lessonProgress.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );

        if (isCompleted) {
          courseCompletedLessons++;
          completedLessons++;
        }
      });
    });

    // Check if course is 100% complete
    if (courseTotalLessons > 0 && courseCompletedLessons === courseTotalLessons) {
      completedCourses++;
    }
  });

  const overallProgress = totalLessons > 0 
    ? Math.round((completedLessons / totalLessons) * 100) 
    : 0;

  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Completed Courses",
      value: completedCourses,
      icon: Trophy,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      label: "Lessons Completed",
      value: `${completedLessons}/${totalLessons}`,
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      label: "Total Learning Hours",
      value: `${totalDuration}h`,
      icon: Clock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="py-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`size-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="py-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">Overall Progress</h3>
              <p className="text-sm text-muted-foreground">
                Your learning journey across all courses
              </p>
            </div>
            <span className="text-2xl font-bold text-primary">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>
    </div>
  );
}
