"use client";

import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getFoodstuffTypes } from "@/lib/utils";

export default function FoodstuffTypeFilter() {
  const [type, setType] = useQueryState("type", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <Select value={type} onValueChange={(v) => setType(v === "all" ? null : v)}>
      <SelectTrigger className="md:w-40 w-full">
        <SelectValue placeholder="All types" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All types</SelectItem>
        {getFoodstuffTypes().map((foodstuffType) => (
          <SelectItem key={foodstuffType.value} value={foodstuffType.value}>
            {foodstuffType.emoji} {foodstuffType.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
