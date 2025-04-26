"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip } from "@/components/ui/chart";

const data = [
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "Warning", value: 18, color: "#f59e0b" },
  { name: "Normal", value: 35, color: "#10b981" },
];

export default function StatusChart() {
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium">
          Status of Trash Bins
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={50}
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltip
                        content={
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{
                                  backgroundColor: payload[0].payload.color,
                                }}
                              />
                              <span className="text-xs font-medium text-white">
                                {payload[0].name}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {payload[0].value} bins (
                              {(
                                ((payload[0].value as number) / 65) *
                                100
                              ).toFixed(0)}
                              %)
                            </div>
                          </div>
                        }
                      />
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-1 flex justify-center gap-4">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-1">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
