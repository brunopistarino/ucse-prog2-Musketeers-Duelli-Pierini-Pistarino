"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  alimentosTypes,
  momentos,
  AlimentosType,
  MomentosType,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Alimento } from "@/lib/zod-schemas";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Alimento>[] = [
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
    accessorKey: "nombre",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-semibold">{row.getValue("nombre")}</span>
    ),
  },
  {
    accessorKey: "tipo",
    header: "Tipo",
    cell: (row) => (
      <Badge variant={"outline"}>
        {alimentosTypes[row.getValue() as AlimentosType] ||
          (row.getValue() as string)}
      </Badge>
    ),
  },
  // {
  //   accessorKey: "momentos",
  //   header: "Momento",
  //   cell: ({ row }) => (
  //     <div className="flex flex-wrap gap-2">
  //       {(row.getValue("momentos") as MomentosType[]).map((momento) => {
  //         const Icon = momentos[momento]?.icon;
  //         return (
  //           <Badge
  //             key={momento}
  //             variant={"outline"}
  //             className="flex items-center gap-2"
  //           >
  //             {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
  //             {momentos[momento]?.label}
  //           </Badge>
  //         );
  //       })}
  //     </div>
  //   ),
  // },

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
    id: "faltante",
    header: "Faltante",
    cell: ({ row }) => {
      const cantidadActual = row.getValue("cantidad_actual") as number;
      const cantidadMinima = row.getValue("cantidad_minima") as number;

      return cantidadMinima - cantidadActual;
    },
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const cantidadActual = row.getValue("cantidad_actual") as number;
      const cantidadMinima = row.getValue("cantidad_minima") as number;
      const precio = row.getValue("precio") as number;

      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
      }).format(precio * (cantidadMinima - cantidadActual));
    },
  },
  {
    accessorKey: "cantidad_actual",
    header: "Cantidad",
    cell: ({ row }) => {
      const cantidadActual = row.getValue("cantidad_actual") as number;
      const cantidadMinima = row.getValue("cantidad_minima") as number;

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
    accessorKey: "cantidad_minima",
    header: () => <></>,
    cell: ({ row }) => {
      const cantidadActual = row.getValue("cantidad_actual") as number;
      const cantidadMinima = row.getValue("cantidad_minima") as number;

      return (
        <div
          className={cn(
            "rounded-full h-4 border-2 w-32 overflow-clip",
            // "rounded-full h-5 border-2 w-32 overflow-clip",
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
          {/* <div
            className={cn(
              "h-full rounded-full flex justify-end items-center px-1.5 text-xs font-semibold text-background",
              cantidadActual >= cantidadMinima
                ? "bg-green-500"
                : cantidadActual / cantidadMinima > 0.66
                ? "bg-yellow-500"
                : cantidadActual / cantidadMinima > 0.33
                ? "bg-orange-500"
                : "bg-red-500"
            )}
            style={{
              width: `${Math.min(
                (cantidadActual / cantidadMinima) * 100,
                100
              )}%`,
            }}
          >
            {cantidadActual}
          </div>*/}
        </div>
      );
    },
    // cell: ({ row }) => {
    //   const cantidadActual = row.getValue("cantidad_actual") as number;
    //   const cantidadMinima = row.getValue("cantidad_minima") as number;

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
    //   const cantidadActual = row.getValue("cantidad_actual") as number;
    //   const cantidadMinima = row.getValue("cantidad_minima") as number;

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
