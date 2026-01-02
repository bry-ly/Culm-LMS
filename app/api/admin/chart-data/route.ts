import { NextResponse } from "next/server";
import { adminGetChartData } from "@/app/data/admin/admin-get-chart-data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(
      searchParams.get("year") || new Date().getFullYear().toString()
    );
    const month = parseInt(
      searchParams.get("month") || new Date().getMonth().toString()
    );

    const chartData = await adminGetChartData(year, month);
    return NextResponse.json(chartData);
  } catch (error) {
    console.error("Failed to fetch chart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
