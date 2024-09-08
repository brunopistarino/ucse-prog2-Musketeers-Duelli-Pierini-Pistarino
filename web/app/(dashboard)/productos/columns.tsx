"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  nombre: string;
  tipo: string;
  momento: string[];
  precio: number;
  cantidadActual: number;
  cantidadMinima: number;
  //   status: "pending" | "processing" | "success" | "failed";
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
  },
  {
    accessorKey: "momento",
    header: "Momento",
  },
  {
    accessorKey: "precio",
    header: "Precio",
  },
  {
    accessorKey: "cantidadActual",
    header: "Cantidad Actual",
  },
  {
    accessorKey: "cantidadMinima",
    header: "Cantidad Minima",
  },
];
