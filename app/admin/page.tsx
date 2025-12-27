import { SectionCards } from "@/components/sidebar/section-cards";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { DataTable } from "@/components/sidebar/data-table";

import data from "./data.json";

export default function AdminIndexPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </div>
  );
}
