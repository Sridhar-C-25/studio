"use client";

import * as React from "react";
import { Pie, PieChart, Sector } from "recharts";
import { PieChart as PieChartIcon } from 'lucide-react';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CategoryChartProps {
  data: { name: string; postCount: number; fill: string }[];
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.map((item) => ({ ...item, category: item.name }));

  const chartConfig = chartData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill };
    return acc;
  }, {} as any);

  const [activeIndex, setActiveIndex] = React.useState(0);

  const activeSector = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-2xl font-bold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };
  

  return (
      <Card className="flex flex-col h-full">
        <CardHeader className="items-center pb-0">
          <CardTitle>Post Distribution by Category</CardTitle>
          <CardDescription>A breakdown of your posts by category.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
            {chartData.length > 0 ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                activeIndex={activeIndex}
                activeShape={activeSector}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                dataKey="postCount"
                nameKey="name"
                innerRadius={80}
                outerRadius={120}
                strokeWidth={5}
              />
            </PieChart>
          </ChartContainer>
           ) : (
                <div className="flex h-[300px] flex-col items-center justify-center space-y-2 text-center">
                    <PieChartIcon className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">No data available</h3>
                    <p className="text-sm text-muted-foreground">
                        Create some posts with categories to see the chart.
                    </p>
                </div>
              )}
        </CardContent>
      </Card>
  );
}
