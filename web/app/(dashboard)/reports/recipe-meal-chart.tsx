"use client";

import { LabelList, Pie, PieChart, Cell } from "recharts";
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
import { getMeal, getMeals } from "@/lib/utils";
import { Meal } from "@/lib/constants";
import { RecipeMealReport } from "@/lib/types";

const chartConfig: ChartConfig = Object.fromEntries(
  getMeals().map((meal) => [
    meal.value,
    { label: meal.name, color: meal.color },
  ])
) as ChartConfig;

interface Props {
  data: RecipeMealReport[];
}

export default function ProductCategoryChart({ data }: Props) {
  return (
    <Card className="flex flex-col flex-1 rounded">
      <CardHeader className="items-center pb-0">
        <CardTitle>Type of use</CardTitle>
        <CardDescription>Number of recipes by type of use</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={data} dataKey="count" nameKey="type_of_use">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.type_of_use].color}
                />
              ))}
              <LabelList
                dataKey="type_of_use"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: Meal) => getMeal(value).name}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
