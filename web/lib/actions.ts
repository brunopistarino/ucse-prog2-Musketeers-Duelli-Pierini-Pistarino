"use server";

import { Alimento, alimentoFormSchema } from "./zod-schemas";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const productos: Alimento[] = [
  {
    nombre: "Tomate",
    tipo: "Verdura",
    momentos: ["Almuerzo", "Cena"],
    precio: 50,
    cantidad_actual: 10,
    cantidad_minima: 5,
  },
  {
    nombre: "Manzana",
    tipo: "Fruta",
    momentos: ["Desayuno", "Merienda"],
    precio: 30,
    cantidad_actual: 20,
    cantidad_minima: 10,
  },
  {
    nombre: "Carne",
    tipo: "Carne",
    momentos: ["Almuerzo", "Cena"],
    precio: 200,
    cantidad_actual: 0,
    cantidad_minima: 2,
  },
  {
    nombre: "Pescado",
    tipo: "Pescado",
    momentos: ["Almuerzo", "Cena"],
    precio: 150,
    cantidad_actual: 1,
    cantidad_minima: 2,
  },
  {
    nombre: "Leche",
    tipo: "Lácteo",
    momentos: ["Desayuno"],
    precio: 60,
    cantidad_actual: 5,
    cantidad_minima: 7,
  },
  {
    nombre: "Huevo",
    tipo: "Lácteo",
    momentos: ["Desayuno"],
    precio: 10,
    cantidad_actual: 10,
    cantidad_minima: 5,
  },
  {
    nombre: "Banana",
    tipo: "Fruta",
    momentos: ["Desayuno", "Merienda"],
    precio: 20,
    cantidad_actual: 8,
    cantidad_minima: 10,
  },
  {
    nombre: "Pollo",
    tipo: "Carne",
    momentos: ["Almuerzo", "Cena"],
    precio: 100,
    cantidad_actual: 5,
    cantidad_minima: 2,
  },
  {
    nombre: "Atun",
    tipo: "Pescado",
    momentos: ["Almuerzo", "Cena"],
    precio: 100,
    cantidad_actual: 1,
    cantidad_minima: 3,
  },
  {
    nombre: "Queso",
    tipo: "Lácteo",
    momentos: ["Desayuno"],
    precio: 80,
    cantidad_actual: 0,
    cantidad_minima: 2,
  },
  {
    nombre: "Yogurt",
    tipo: "Lácteo",
    momentos: ["Desayuno"],
    precio: 40,
    cantidad_actual: 5,
    cantidad_minima: 2,
  },
  {
    nombre: "Pera",
    tipo: "Fruta",
    momentos: ["Desayuno", "Merienda"],
    precio: 30,
    cantidad_actual: 1,
    cantidad_minima: 10,
  },
  {
    nombre: "Cerdo",
    tipo: "Carne",
    momentos: ["Almuerzo", "Cena"],
    precio: 150,
    cantidad_actual: 5,
    cantidad_minima: 2,
  },
  {
    nombre: "Salmon",
    tipo: "Pescado",
    momentos: ["Almuerzo", "Cena"],
    precio: 200,
    cantidad_actual: 3,
    cantidad_minima: 1,
  },
  {
    nombre: "Manteca",
    tipo: "Lácteo",
    momentos: ["Desayuno"],
    precio: 60,
    cantidad_actual: 0,
    cantidad_minima: 2,
  },
  {
    nombre: "Lechuga",
    tipo: "Verdura",
    momentos: ["Almuerzo", "Cena"],
    precio: 40,
    cantidad_actual: 5,
    cantidad_minima: 2,
  },
  {
    nombre: "Aceite",
    tipo: "Verdura",
    momentos: ["Almuerzo", "Cena"],
    precio: 100,
    cantidad_actual: 1,
    cantidad_minima: 2,
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

export async function getAlimentosBelowMinimum(name?: string, type?: string) {
  try {
    const response = await axios.get(
      `${process.env.API_URL}alimentos/below_minimum`,
      {
        params: {
          name,
          type,
        },
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
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
    return { data: response.data, error: null };
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
    return { data: response.data, error: null };
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
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

function formatError(error: unknown) {
  if (axios.isAxiosError(error)) {
    return {
      data: null,
      error: error.response?.data || { msg: [{ description: error.message }] },
    };
  }
  return {
    data: null,
    error: { msg: [{ description: "Se produjo un error inesperado" }] },
  };
}

// function formatError(error: unknown) {
//   if (axios.isAxiosError(error)) {
//     return { error: error.response?.data.error || error.message };
//   }
//   return { error: "Se produjo un error inesperado" };
// }

export async function getRecipes() {
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  return recetas;
}
