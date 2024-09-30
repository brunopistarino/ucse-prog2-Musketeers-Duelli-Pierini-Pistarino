"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils";

interface CostData {
  month: string;
  average_cost: number;
}

interface MonthlyCostChartProps {
  data: CostData[];
}

const chartConfig = {
  average_cost: {
    label: "Average Cost",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function MonthlyCostChart({ data }: MonthlyCostChartProps) {
  const total = React.useMemo(
    () => data.reduce((acc, curr) => acc + curr.average_cost, 0),
    [data]
  );

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Costo mensual</CardTitle>
          <CardDescription>
            Costos del último año agrupado por mes
          </CardDescription>
        </div>
        <div className="cursor-default relative z-30 flex flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
          <span className="text-xs text-muted-foreground">Total</span>
          <span className="text-lg font-bold leading-none sm:text-3xl">
            {formatCurrency(total)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={data}
            margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-AR", {
                  month: "short",
                  year: "2-digit",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="average_cost"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-AR", {
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
              }
            />
            <Bar dataKey="average_cost" fill={chartConfig.average_cost.color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}