import { AppSidebar } from "@/components/app-sidebar";
import CostSavingChart from "@/components/cost-saving-chart";
import MapHeatmap from "@/components/map-heatmap";
import MetricsChart from "@/components/metrics-chart";
import { SiteHeader } from "@/components/site-header";
import StatusChart from "@/components/status-chart";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <StatusChart />
            <MetricsChart />
            <CostSavingChart />
          </div>

          {/* This will be replaced with Google Maps */}
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <MapHeatmap />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
