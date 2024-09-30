"use client";
import QuantityBar from "@/components/quantity-bar";
import { Badge } from "@/components/ui/badge";
import { FoodstuffType, Meal } from "@/lib/constants";
import { formatCurrency, getFoodstuffType, getMeal } from "@/lib/utils";
import { Foodstuff } from "@/lib/zod-schemas";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export const columns: ColumnDef<Foodstuff>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: (row) => (
      <span className="font-semibold">{row.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: (row) => {
      const foodstuffType = getFoodstuffType(row.getValue() as FoodstuffType);
      return (
        <Badge variant="outline" className="whitespace-nowrap">
          {foodstuffType.emoji} {foodstuffType.name}
        </Badge>
      );
    },
  },
  {
    accessorKey: "meals",
    header: "Momento",
    cell: (row) => {
      const meals = row.getValue() as Meal[];
      return (
        <div className="flex gap-2">
          {meals.map((meal) => {
            const mealInfo = getMeal(meal);
            return (
              <Badge key={meal} variant="outline" className="whitespace-nowrap">
                {mealInfo.emoji} {mealInfo.name}
              </Badge>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: (row) => formatCurrency(row.getValue() as number),
  },
  {
    accessorKey: "current_quantity",
    header: "Cantidad",
    cell: ({ row }) => {
      const currentQuantity = row.getValue("current_quantity");
      const minimumQuantity = row.getValue("minimum_quantity");
      return `${currentQuantity} / ${minimumQuantity}`;
    },
  },
  {
    accessorKey: "minimum_quantity",
    header: () => <></>,
    cell: ({ row }) => (
      <QuantityBar
        currentQuantity={row.getValue("current_quantity")}
        minimumQuantity={row.getValue("minimum_quantity")}
      />
    ),
  },
];
