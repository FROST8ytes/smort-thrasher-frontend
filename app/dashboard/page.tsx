import CostSavingChart from "@/components/cost-saving-chart";
import MapHeatmap from "@/components/map-heatmap";
import MetricsChart from "@/components/metrics-chart";
import StatusChart from "@/components/status-chart";

export default function Page() {
  return (
    <>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatusChart />
        <MetricsChart />
        <CostSavingChart />
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
        <MapHeatmap />
      </div>
    </>
  );
}
