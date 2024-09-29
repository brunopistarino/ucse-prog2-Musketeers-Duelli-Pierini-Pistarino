"use client";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Meal, momentos } from "@/lib/constants";

export default function MealFilter() {
  const [meal, setMeal] = useQueryState("meal", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <Select value={meal} onValueChange={(v) => setMeal(v === "all" ? null : v)}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Todos los momentos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los momentos</SelectItem>
        {Object.keys(momentos).map((key) => (
          <SelectItem key={key} value={key}>
            {momentos[key as Meal].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
