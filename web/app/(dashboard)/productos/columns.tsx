"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Clock12, Clock3, Clock6, Clock9 } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type ProductType = "verdura" | "fruta" | "carne" | "pescado" | "lacteo";
type Moment = "desayuno" | "almuerzo" | "merienda" | "cena";

export type Product = {
  nombre: string;
  tipo: ProductType;
  momento: Moment[];
  precio: number;
  cantidadActual: number;
  cantidadMinima: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    // cell: (row) => tipos[row.getValue()],
    cell: (row) => (
      <Badge variant={"outline"}>{tipos[row.getValue() as ProductType]}</Badge>
    ),
  },
  {
    accessorKey: "momento",
    header: "Momento",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {(row.getValue("momento") as Moment[]).map((momento) => {
          const Icon = momentos[momento].icon;
          return (
            <Badge
              key={momento}
              variant={"outline"}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {momentos[momento].label}
            </Badge>
          );
        })}
      </div>
    ),
  },
  {
    accessorKey: "precio",
    header: "Precio",
    cell: ({ row }) =>
      new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(row.getValue("precio")),
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

const tipos = {
  verdura: "🥬 Verdura",
  fruta: "🍎 Fruta",
  carne: "🥩 Carne",
  pescado: "🐟 Pescado",
  lacteo: "🥛 Lácteo",
};

const momentos = {
  desayuno: {
    label: "Desayuno",
    icon: Clock6,
  },
  almuerzo: {
    label: "Almuerzo",
    icon: Clock12,
  },
  merienda: {
    label: "Merienda",
    icon: Clock3,
  },
  cena: {
    label: "Cena",
    icon: Clock9,
  },
};
