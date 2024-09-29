"use client";
import { useQueryState } from "nuqs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { foodstuffsTypes, FoodstuffType } from "@/lib/constants";
import { getFoodstuffType } from "@/lib/utils";

export default function FoodstuffTypeFilter() {
  const [type, setType] = useQueryState("type", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <Select value={type} onValueChange={(v) => setType(v === "all" ? null : v)}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Todos los tipos" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los tipos</SelectItem>
        {Object.keys(foodstuffsTypes).map((key) => {
          const foodstuffType = getFoodstuffType(key as FoodstuffType);
          return (
            <SelectItem key={key} value={key}>
              {foodstuffType.emoji} {foodstuffType.name}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
