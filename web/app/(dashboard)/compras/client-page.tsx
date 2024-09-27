"use client";
import { Button } from "@/components/ui/button";
import Filters from "./filters";
import { DollarSign } from "lucide-react";
import { columns } from "./columns";
import { Alimento } from "@/lib/zod-schemas";
import { DataTable } from "./data-table";
import { useState } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import FormDialog from "./form-dialog";

interface Props {
  data: Alimento[];
}

export default function ClientPage({ data }: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center px-6 py-4 justify-between sticky top-0 bg-card z-50">
        <h1 className="text-lg font-semibold md:text-2xl">Compras</h1>
        <div className="flex gap-2">
          <Filters />
          <FormDialog
            foodstuffs={
              table
                .getSelectedRowModel()
                .flatRows.map((row) => row.original) as Alimento[]
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
      <pre>
        {JSON.stringify(
          table.getSelectedRowModel().flatRows.map((row) => row.original.id),
          null,
          2
        )}
      </pre>
    </div>
  );
}
