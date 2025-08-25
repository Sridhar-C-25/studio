"use client";

import * as React from "react";
import { Pie, PieChart, Cell, Tooltip } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface CategoryChartProps {
  data: { name: string; postCount: number; fill: string }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((item) => ({ ...item, category: item.name }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as any);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-[300px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent nameKey="postCount" hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="postCount"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
          labelLine={false}
          paddingAngle={5}
        >
          {chartData.map((entry) => (
            <Cell key={`cell-${entry.name}`} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey="name" />}
          className="-translate-y-[2rem] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
      </PieChart>
    </ChartContainer>
  );
}
