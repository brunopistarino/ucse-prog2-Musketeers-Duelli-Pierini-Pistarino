"use client";

import { Badge } from "@/components/ui/badge";
import { productTypes, moments } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

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
      <Badge variant={"outline"}>
        {productTypes[row.getValue() as ProductType]}
      </Badge>
    ),
  },
  {
    accessorKey: "momento",
    header: "Momento",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-2">
        {(row.getValue("momento") as Moment[]).map((momento) => {
          const Icon = moments[momento].icon;
          return (
            <Badge
              key={momento}
              variant={"outline"}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              {moments[momento].label}
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
    header: "Cantidad",
    cell: ({ row }) => {
      const cantidadActual = row.getValue("cantidadActual") as number;
      const cantidadMinima = row.getValue("cantidadMinima") as number;

      return (
        <div className="">
          {cantidadActual} / {cantidadMinima}
        </div>
      );
      //   return <Badge variant="outline">{row.getValue("cantidadActual")}</Badge>;
    },
  },
  //   {
  //     accessorKey: "cantidadActual",
  //     header: "Cantidad Actual",
  //   },
  {
    accessorKey: "cantidadMinima",
    header: () => <></>,
    cell: ({ row }) => {
      const cantidadActual = row.getValue("cantidadActual") as number;
      const cantidadMinima = row.getValue("cantidadMinima") as number;

      return (
        <div
          className={cn(
            "rounded-full h-4 border-2 w-32 overflow-clip",
            cantidadActual === 0 && "border-red-500"
            // cantidadActual >= cantidadMinima ? "bg-green-500" : "bg-red-500"
          )}
        >
          <div
            className={cn(
              "h-full rounded-full",
              cantidadActual >= cantidadMinima
                ? "bg-green-500"
                : cantidadActual / cantidadMinima > 0.66
                ? "bg-yellow-500"
                : cantidadActual / cantidadMinima > 0.33
                ? "bg-orange-500"
                : "bg-red-500"
            )}
            style={{
              width: `${(cantidadActual / cantidadMinima) * 100}%`,
            }}
          />
        </div>
      );
    },
    // cell: ({ row }) => {
    //   const cantidadActual = row.getValue("cantidadActual") as number;
    //   const cantidadMinima = row.getValue("cantidadMinima") as number;

    //   return (
    //     <div
    //       className={cn(
    //         "rounded-full h-5 border-2 w-32 overflow-clip relative",
    //         cantidadActual === 0 && "border-red-500"
    //         // cantidadActual >= cantidadMinima ? "bg-green-500" : "bg-red-500"
    //       )}
    //     >
    //       <div
    //         className={cn(
    //           "h-full rounded-full",
    //           cantidadActual >= cantidadMinima
    //             ? "bg-green-500"
    //             : cantidadActual / cantidadMinima > 0.66
    //             ? "bg-yellow-500"
    //             : cantidadActual / cantidadMinima > 0.33
    //             ? "bg-orange-500"
    //             : "bg-red-500"
    //         )}
    //         style={{
    //           width: `${(cantidadActual / cantidadMinima) * 100}%`,
    //         }}
    //       ></div>
    //       <div className="absolute -top-0.5 flex w-full justify-between px-1.5 font-semibold">
    //         <p className="">{cantidadActual}</p>
    //         <p>{cantidadMinima}</p>
    //       </div>
    //     </div>
    //   );
    // },
    // cell: ({ row }) => {
    //   const cantidadActual = row.getValue("cantidadActual") as number;
    //   const cantidadMinima = row.getValue("cantidadMinima") as number;

    //   return (
    //     <div className="flex gap-2 items-center">
    //       <p>{cantidadActual}</p>
    //       <div
    //         className={cn(
    //           "rounded-full h-4 border-2 w-32 overflow-clip",
    //           cantidadActual === 0 && "border-red-500"
    //           // cantidadActual >= cantidadMinima ? "bg-green-500" : "bg-red-500"
    //         )}
    //       >
    //         <div
    //           className={cn(
    //             "h-full rounded-full",
    //             cantidadActual >= cantidadMinima
    //               ? "bg-green-500"
    //               : cantidadActual / cantidadMinima > 0.66
    //               ? "bg-yellow-500"
    //               : cantidadActual / cantidadMinima > 0.33
    //               ? "bg-orange-500"
    //               : "bg-red-500"
    //           )}
    //           style={{
    //             width: `${(cantidadActual / cantidadMinima) * 100}%`,
    //           }}
    //         />
    //       </div>
    //       {cantidadMinima}
    //     </div>
    //   );
    // },
  },
];
