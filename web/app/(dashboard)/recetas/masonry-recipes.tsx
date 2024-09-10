"use client";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { productTypes } from "@/lib/constants";
import { useEffect, useState } from "react";
type ProductType = "verdura" | "fruta" | "carne" | "pescado" | "lacteo";

const columns = {
  600: 2,
  800: 3,
  1200: 4,
};

type Receta = {
  nombre: string;
  momento: string;
  ingredientes: {
    producto: {
      nombre: string;
      tipo: string;
    };
    cantidad: number;
  }[];
};

export default function MasonryRecipes({ recipes }: { recipes: Receta[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null until the component is mounted
  if (!isMounted) return null;

  return (
    <ResponsiveMasonry columnsCountBreakPoints={columns}>
      <Masonry gutter="16px">
        {/* <div className="grid grid-cols-3 gap-4"> */}
        {recipes.map((recipe, x) => (
          <RecetaItem key={x} receta={recipe} />
        ))}
        {/* </div> */}
      </Masonry>
    </ResponsiveMasonry>
  );
}

const RecetaItem = ({ receta }: { receta: Receta }) => (
  <div className="bg-border p-1 rounded-lg">
    <div className="flex flex-col gap-2 border py-4 px-6 bg-card rounded-md">
      <h2 className="text-lg font-semibold">{receta.nombre}</h2>
      <p className="text-sm text-muted-foreground">{receta.momento}</p>
      <ul className="list-disc list-inside">
        {receta.ingredientes.map((ingrediente) => (
          //   <li key={ingrediente.producto.nombre}>
          //     {productTypes[ingrediente.producto.tipo].slice(0, 2)}{" "}
          //     {ingrediente.producto.nombre} x {ingrediente.cantidad}
          //   </li>
          <div
            key={ingrediente.producto.nombre}
            className="flex items-center gap-2"
          >
            <p className="shrink-0">
              {productTypes[ingrediente.producto.tipo as ProductType].slice(
                0,
                2
              )}{" "}
              {ingrediente.producto.nombre}
            </p>
            <div className="border-b w-full border-dashed border-gray-300" />
            <p className="font-mono">{ingrediente.cantidad}</p>
          </div>
        ))}
      </ul>
    </div>
  </div>
);
