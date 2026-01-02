"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ChartDataPoint } from "@/app/data/admin/admin-get-chart-data";

export const description = "An interactive bar chart";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  activity: {
    label: "Activity",
  },
  signups: {
    label: "Signups",
    color: "var(--primary)",
  },
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  initialData: ChartDataPoint[];
  initialMonth: number;
  year: number;
}

export function ChartAreaInteractive({
  initialData,
  initialMonth,
  year,
}: ChartAreaInteractiveProps) {
  const [selectedMonth, setSelectedMonth] = React.useState(
    initialMonth.toString()
  );
  const [chartData, setChartData] = React.useState(initialData);
  const [isLoading, setIsLoading] = React.useState(false);

  // Fetch new data when month changes
  React.useEffect(() => {
    const monthNum = parseInt(selectedMonth);
    if (monthNum === initialMonth) {
      setChartData(initialData);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/admin/chart-data?year=${year}&month=${monthNum}`
        );
        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        }
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, year, initialMonth, initialData]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Platform Activity {year}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Daily signups and enrollments
          </span>
          <span className="@[540px]/card:hidden">Daily activity</span>
        </CardDescription>
        <CardAction>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-40" size="sm" aria-label="Select month">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {monthNames.map((month, index) => (
                <SelectItem
                  key={index}
                  value={index.toString()}
                  className="rounded-lg"
                >
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-[250px]">
            <span className="text-muted-foreground">Loading...</span>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.getDate().toString();
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="signups"
                fill="var(--color-signups)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="enrollments"
                fill="var(--color-enrollments)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
