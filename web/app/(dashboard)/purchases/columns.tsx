"use client";

import QuantityBar from "@/components/quantity-bar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FoodstuffType } from "@/lib/constants";
import { formatCurrency, getFoodstuffType } from "@/lib/utils";
import { Foodstuff } from "@/lib/zod-schemas";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";

export const columns: ColumnDef<Foodstuff>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Nombre",
    cell: (row) => (
      <span className="font-semibold">{row.renderValue() as string}</span>
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
    accessorKey: "price",
    header: "Precio",
    cell: (row) => formatCurrency(row.getValue() as number),
  },
  {
    id: "missing",
    header: "Faltante",
    cell: ({ row }) => {
      const currentQuantity = row.getValue("current_quantity") as number;
      const minimumQuantity = row.getValue("minimum_quantity") as number;

      return minimumQuantity - currentQuantity;
    },
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const currentQuantity = row.getValue("current_quantity") as number;
      const minimumQuantity = row.getValue("minimum_quantity") as number;
      const price = row.getValue("price") as number;

      return formatCurrency(price * (minimumQuantity - currentQuantity));
    },
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
