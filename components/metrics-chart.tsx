"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChartTooltip } from "@/components/ui/chart";

// Sample data
const dayData = [
  { time: "00:00", fuel: 12, distance: 15, emission: 8 },
  { time: "04:00", fuel: 19, distance: 25, emission: 12 },
  { time: "08:00", fuel: 30, distance: 40, emission: 20 },
  { time: "12:00", fuel: 25, distance: 35, emission: 18 },
  { time: "16:00", fuel: 40, distance: 60, emission: 25 },
  { time: "20:00", fuel: 35, distance: 50, emission: 22 },
];

const weekData = [
  { time: "Mon", fuel: 120, distance: 150, emission: 80 },
  { time: "Tue", fuel: 190, distance: 250, emission: 120 },
  { time: "Wed", fuel: 300, distance: 400, emission: 200 },
  { time: "Thu", fuel: 250, distance: 350, emission: 180 },
  { time: "Fri", fuel: 400, distance: 600, emission: 250 },
  { time: "Sat", fuel: 350, distance: 500, emission: 220 },
  { time: "Sun", fuel: 200, distance: 300, emission: 150 },
];

const monthData = [
  { time: "Week 1", fuel: 520, distance: 750, emission: 380 },
  { time: "Week 2", fuel: 690, distance: 950, emission: 520 },
  { time: "Week 3", fuel: 800, distance: 1200, emission: 600 },
  { time: "Week 4", fuel: 750, distance: 1100, emission: 580 },
];

export default function MetricsChart() {
  const [selectedMetric, setSelectedMetric] = useState("fuel");
  const [timeRange, setTimeRange] = useState("day");

  const getDataForTimeRange = () => {
    switch (timeRange) {
      case "day":
        return dayData;
      case "week":
        return weekData;
      case "month":
        return monthData;
      default:
        return dayData;
    }
  };

  const getMetricColor = () => {
    switch (selectedMetric) {
      case "fuel":
        return "#f59e0b";
      case "distance":
        return "#3b82f6";
      case "emission":
        return "#10b981";
      default:
        return "#f59e0b";
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case "fuel":
        return "Fuel Consumption (L)";
      case "distance":
        return "Distance Traveled (km)";
      case "emission":
        return "Emission Rate (kg CO₂)";
      default:
        return "Value";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Metrics</CardTitle>
          <Tabs
            value={timeRange}
            onValueChange={setTimeRange}
            className="w-auto"
          >
            <TabsList className="h-7 p-1">
              <TabsTrigger value="day" className="text-xs px-2 py-0.5">
                Day
              </TabsTrigger>
              <TabsTrigger value="week" className="text-xs px-2 py-0.5">
                Week
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs px-2 py-0.5">
                Month
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[100px] mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getDataForTimeRange()}>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#333" }}
              />
              <YAxis hide domain={["auto", "auto"]} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltip
                        content={
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-white">
                              {label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {getMetricLabel()}: {payload[0].value}
                            </span>
                          </div>
                        }
                      />
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={getMetricColor()}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-1">
          <button
            onClick={() => setSelectedMetric("distance")}
            className={`flex items-center justify-center text-xs px-2 py-1 rounded ${
              selectedMetric === "distance"
                ? "bg-blue-900/50 text-blue-400"
                : "hover:bg-gray-800"
            }`}
          >
            Travel Distance
          </button>
          <button
            onClick={() => setSelectedMetric("fuel")}
            className={`flex items-center justify-center text-xs px-2 py-1 rounded ${
              selectedMetric === "fuel"
                ? "bg-amber-900/50 text-amber-400"
                : "hover:bg-gray-800"
            }`}
          >
            Fuel Consumption
          </button>
          <button
            onClick={() => setSelectedMetric("emission")}
            className={`flex items-center justify-center text-xs px-2 py-1 rounded ${
              selectedMetric === "emission"
                ? "bg-green-900/50 text-green-400"
                : "hover:bg-gray-800"
            }`}
          >
            Emission Rate
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
