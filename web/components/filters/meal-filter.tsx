"use client";

import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getMeals } from "@/lib/utils";

export default function MealFilter() {
  const [meal, setMeal] = useQueryState("meal", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <Select value={meal} onValueChange={(v) => setMeal(v === "all" ? null : v)}>
      <SelectTrigger className="md:w-40 w-full">
        <SelectValue placeholder="All meals" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All meals</SelectItem>
        {getMeals().map((meal) => (
          <SelectItem key={meal.value} value={meal.value}>
            {meal.emoji} {meal.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
