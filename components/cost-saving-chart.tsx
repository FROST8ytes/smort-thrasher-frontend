"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChartTooltip } from "@/components/ui/chart";

const data = [
  {
    name: "Q1",
    before: 4000,
    after: 2400,
  },
  {
    name: "Q2",
    before: 3000,
    after: 1398,
  },
  {
    name: "Q3",
    before: 2000,
    after: 980,
  },
  {
    name: "Q4",
    before: 2780,
    after: 1208,
  },
];

export default function CostSavingChart() {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">
          Cost Saving Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={0}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#333" }}
              />
              <YAxis hide domain={[0, "auto"]} />
              <CartesianGrid
                vertical={false}
                stroke="rgba(255, 255, 255, 0.05)"
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltip
                        content={
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-medium text-white">
                              {label}
                            </span>
                            {payload.map((entry, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1"
                              >
                                <div
                                  className="h-2 w-2 rounded-full"
                                  style={{
                                    backgroundColor:
                                      entry.dataKey === "before"
                                        ? "#ef4444"
                                        : "#10b981",
                                  }}
                                />
                                <span className="text-xs text-muted-foreground">
                                  {entry.dataKey === "before"
                                    ? "Before"
                                    : "After"}
                                  : RM {entry.value}
                                </span>
                              </div>
                            ))}
                            {payload.length >= 2 && (
                              <div className="flex items-center gap-1 mt-1 pt-1 border-t border-gray-700">
                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                <span className="text-xs text-muted-foreground">
                                  Saving: RM{" "}
                                  {(payload[0].value as number) -
                                    (payload[1].value as number)}
                                </span>
                              </div>
                            )}
                          </div>
                        }
                      />
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="before" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="after" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1 flex justify-center gap-4">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-xs">Before</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-xs">After</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-xs">
              Savings: RM{" "}
              {data.reduce((acc, item) => acc + (item.before - item.after), 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
