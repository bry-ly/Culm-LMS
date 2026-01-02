import { SectionCards } from "@/components/sidebar/section-cards";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { adminGetChartData } from "@/app/data/admin/admin-get-chart-data";

export default async function AdminIndexPage() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const chartData = await adminGetChartData(year, month);

  return (
    <>
      <SectionCards />

      <ChartAreaInteractive
        initialData={chartData}
        initialMonth={month}
        year={year}
      />
    </>
  );
}
