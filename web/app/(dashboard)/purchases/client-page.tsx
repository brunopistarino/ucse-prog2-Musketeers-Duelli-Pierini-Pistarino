"use client";

import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { columns } from "./columns";
import { Foodstuff } from "@/lib/zod-schemas";
import { DataTable } from "./data-table";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import FormDialog from "./form-dialog";
import NameFilter from "@/components/filters/name-filter";
import FoodstuffTypeFilter from "@/components/filters/foodstuff-type-filter";

interface Props {
  data: Foodstuff[];
}

export default function ClientPage({ data }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.id ?? `row-${index}`,
  });

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center px-6 py-4 justify-between sticky top-0 bg-card z-50 flex-col md:flex-row gap-2 md:overflow-x-auto md:overflow-y-clip">
        <h1 className="text-lg font-semibold md:text-2xl">Compras</h1>
        <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto">
          <NameFilter />
          <FoodstuffTypeFilter />
          <FormDialog
            foodstuffs={
              table
                .getSelectedRowModel()
                .flatRows.map((row) => row.original) as Foodstuff[]
            }
          >
            <Button
              className="gap-2"
              disabled={table.getSelectedRowModel().flatRows.length < 1}
            >
              <DollarSign size={16} />
              Hacer compra
            </Button>
          </FormDialog>
        </div>
      </div>
      <DataTable table={table} />
    </div>
  );
}
