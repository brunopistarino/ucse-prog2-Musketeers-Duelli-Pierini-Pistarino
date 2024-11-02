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
import { getFoodstuffTypes } from "@/lib/utils";
import { RecipeFoodstuffTypeReport } from "@/lib/types";
import { FoodstuffType } from "@/lib/constants";

const chartConfig: ChartConfig = Object.fromEntries(
  getFoodstuffTypes().map((foodstuffType) => [
    foodstuffType.value,
    { label: foodstuffType.name, color: foodstuffType.color },
  ])
) as ChartConfig;

interface Porps {
  data: RecipeFoodstuffTypeReport[];
}

export default function RecipeFoodstuffTypeChart({ data }: Porps) {
  return (
    <Card className="flex flex-col flex-1 rounded">
      <CardHeader className="items-center pb-0">
        <CardTitle>Foodstuff type</CardTitle>
        <CardDescription>
          Number of recipes by type of foodstuff
        </CardDescription>
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
            <Pie data={data} dataKey="count" nameKey="type_of_foodstuff">
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.type_of_foodstuff].color}
                />
              ))}
              <LabelList
                dataKey="type_of_foodstuff"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: FoodstuffType) => chartConfig[value]?.label}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
