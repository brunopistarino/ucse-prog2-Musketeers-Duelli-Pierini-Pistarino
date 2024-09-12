"use server";

import { Product } from "@/app/(dashboard)/alimentos/columns";
import { alimentoFormSchema } from "./zod-schemas";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productos: Product[] = [
  {
    nombre: "Tomate",
    tipo: "Verdura",
    momento: ["Almuerzo", "Cena"],
    precio: 50,
    cantidadActual: 10,
    cantidadMinima: 5,
  },
  {
    nombre: "Manzana",
    tipo: "Fruta",
    momento: ["Desayuno", "Merienda"],
    precio: 30,
    cantidadActual: 20,
    cantidadMinima: 10,
  },
  {
    nombre: "Carne",
    tipo: "Carne",
    momento: ["Almuerzo", "Cena"],
    precio: 200,
    cantidadActual: 0,
    cantidadMinima: 2,
  },
  {
    nombre: "Pescado",
    tipo: "Pescado",
    momento: ["Almuerzo", "Cena"],
    precio: 150,
    cantidadActual: 1,
    cantidadMinima: 2,
  },
  {
    nombre: "Leche",
    tipo: "Lácteo",
    momento: ["Desayuno"],
    precio: 60,
    cantidadActual: 5,
    cantidadMinima: 7,
  },
  {
    nombre: "Huevo",
    tipo: "Lácteo",
    momento: ["Desayuno"],
    precio: 10,
    cantidadActual: 10,
    cantidadMinima: 5,
  },
  {
    nombre: "Banana",
    tipo: "Fruta",
    momento: ["Desayuno", "Merienda"],
    precio: 20,
    cantidadActual: 8,
    cantidadMinima: 10,
  },
  {
    nombre: "Pollo",
    tipo: "Carne",
    momento: ["Almuerzo", "Cena"],
    precio: 100,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Atun",
    tipo: "Pescado",
    momento: ["Almuerzo", "Cena"],
    precio: 100,
    cantidadActual: 1,
    cantidadMinima: 3,
  },
  {
    nombre: "Queso",
    tipo: "Lácteo",
    momento: ["Desayuno"],
    precio: 80,
    cantidadActual: 0,
    cantidadMinima: 2,
  },
  {
    nombre: "Yogurt",
    tipo: "Lácteo",
    momento: ["Desayuno"],
    precio: 40,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Pera",
    tipo: "Fruta",
    momento: ["Desayuno", "Merienda"],
    precio: 30,
    cantidadActual: 1,
    cantidadMinima: 10,
  },
  {
    nombre: "Cerdo",
    tipo: "Carne",
    momento: ["Almuerzo", "Cena"],
    precio: 150,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Salmon",
    tipo: "Pescado",
    momento: ["Almuerzo", "Cena"],
    precio: 200,
    cantidadActual: 3,
    cantidadMinima: 1,
  },
  {
    nombre: "Manteca",
    tipo: "Lácteo",
    momento: ["Desayuno"],
    precio: 60,
    cantidadActual: 0,
    cantidadMinima: 2,
  },
  {
    nombre: "Lechuga",
    tipo: "Verdura",
    momento: ["Almuerzo", "Cena"],
    precio: 40,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Aceite",
    tipo: "Verdura",
    momento: ["Almuerzo", "Cena"],
    precio: 100,
    cantidadActual: 1,
    cantidadMinima: 2,
  },
];

const recetas = [
  {
    nombre: "Ensalada de tomate",
    momento: "Almuerzo",
    ingredientes: [
      { producto: productos[0], cantidad: 2 },
      { producto: productos[15], cantidad: 1 },
      { producto: productos[16], cantidad: 1 },
    ],
  },
  {
    nombre: "Ensalada de frutas",
    momento: "Merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 1 },
      { producto: productos[3], cantidad: 1 },
      { producto: productos[2], cantidad: 1 },
      { producto: productos[0], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
      { producto: productos[11], cantidad: 1 },
    ],
  },
  {
    nombre: "Milanesa con pure",
    momento: "cena",
    ingredientes: [
      { producto: productos[2], cantidad: 1 },
      { producto: productos[15], cantidad: 1 },
    ],
  },
  {
    nombre: "Sushi",
    momento: "cena",
    ingredientes: [
      { producto: productos[3], cantidad: 1 },
      { producto: productos[15], cantidad: 1 },
      { producto: productos[16], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de manzana",
    momento: "merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 2 },
      { producto: productos[5], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
      { producto: productos[11], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de frutas",
    momento: "merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 1 },
      { producto: productos[5], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
      { producto: productos[11], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de banana",
    momento: "merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 1 },
      { producto: productos[5], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
      { producto: productos[11], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de pera",
    momento: "merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 1 },
      { producto: productos[3], cantidad: 1 },
      { producto: productos[7], cantidad: 1 },
      { producto: productos[11], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de manzana",
    momento: "merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 1 },
      { producto: productos[5], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de frutas",
    momento: "merienda",
    ingredientes: [
      { producto: productos[2], cantidad: 1 },
      { producto: productos[5], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
      { producto: productos[10], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de banana",
    momento: "merienda",
    ingredientes: [
      { producto: productos[3], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
      { producto: productos[9], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de pera",
    momento: "merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 1 },
      { producto: productos[9], cantidad: 1 },
      { producto: productos[7], cantidad: 1 },
      { producto: productos[11], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de manzana",
    momento: "merienda",
    ingredientes: [
      { producto: productos[3], cantidad: 1 },
      { producto: productos[10], cantidad: 1 },
    ],
  },
  {
    nombre: "Tarta de frutas",
    momento: "merienda",
    ingredientes: [
      { producto: productos[1], cantidad: 1 },
      { producto: productos[5], cantidad: 1 },
      { producto: productos[6], cantidad: 1 },
      { producto: productos[11], cantidad: 1 },
    ],
  },
];

export async function getAlimentos() {
  try {
    const response = await fetch(`${process.env.API_URL}alimentos`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
}

export async function getAlimentosBelowMinimum() {
  try {
    const response = await fetch(
      `${process.env.API_URL}alimentos/below_minimum`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("There was an error!", error);
  }
}

export async function createAlimento(values: unknown) {
  const result = alimentoFormSchema.safeParse(values);

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    const response = await axios.post(
      `${process.env.API_URL}alimentos`,
      result.data
    );
    revalidatePath("/alimentos");
    return { data: response.data };
  } catch (error) {
    return formatError(error);
  }
}

export async function updateAlimento(values: unknown) {
  const result = alimentoFormSchema.safeParse(values);

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  try {
    const response = await axios.put(
      `${process.env.API_URL}alimentos/${result.data.id}`,
      values
    );
    revalidatePath("/alimentos");
    return { data: response.data };
  } catch (error) {
    return formatError(error);
  }
}

export async function deleteAlimento(id: string) {
  try {
    const response = await axios.delete(
      `${process.env.API_URL}alimentos/${id}`
    );
    revalidatePath("/alimentos");
    return { data: response.data };
  } catch (error) {
    return formatError(error);
  }
}

function formatError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data.error || error.message;
  }
  return "Se produjo un error inesperado";
}

export async function getRecipes() {
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  return recetas;
}
