import { Product } from "@/app/(dashboard)/productos/columns";

const productos: Product[] = [
  {
    nombre: "Tomate",
    tipo: "verdura",
    momento: ["almuerzo", "cena"],
    precio: 50,
    cantidadActual: 10,
    cantidadMinima: 5,
  },
  {
    nombre: "Manzana",
    tipo: "fruta",
    momento: ["desayuno", "merienda"],
    precio: 30,
    cantidadActual: 20,
    cantidadMinima: 10,
  },
  {
    nombre: "Carne",
    tipo: "carne",
    momento: ["almuerzo", "cena"],
    precio: 200,
    cantidadActual: 0,
    cantidadMinima: 2,
  },
  {
    nombre: "Pescado",
    tipo: "pescado",
    momento: ["almuerzo", "cena"],
    precio: 150,
    cantidadActual: 1,
    cantidadMinima: 2,
  },
  {
    nombre: "Leche",
    tipo: "lacteo",
    momento: ["desayuno"],
    precio: 60,
    cantidadActual: 5,
    cantidadMinima: 7,
  },
  {
    nombre: "Huevo",
    tipo: "lacteo",
    momento: ["desayuno"],
    precio: 10,
    cantidadActual: 10,
    cantidadMinima: 5,
  },
  {
    nombre: "Banana",
    tipo: "fruta",
    momento: ["desayuno", "merienda"],
    precio: 20,
    cantidadActual: 8,
    cantidadMinima: 10,
  },
  {
    nombre: "Pollo",
    tipo: "carne",
    momento: ["almuerzo", "cena"],
    precio: 100,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Atun",
    tipo: "pescado",
    momento: ["almuerzo", "cena"],
    precio: 100,
    cantidadActual: 1,
    cantidadMinima: 3,
  },
  {
    nombre: "Queso",
    tipo: "lacteo",
    momento: ["desayuno"],
    precio: 80,
    cantidadActual: 0,
    cantidadMinima: 2,
  },
  {
    nombre: "Yogurt",
    tipo: "lacteo",
    momento: ["desayuno"],
    precio: 40,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Pera",
    tipo: "fruta",
    momento: ["desayuno", "merienda"],
    precio: 30,
    cantidadActual: 1,
    cantidadMinima: 10,
  },
  {
    nombre: "Cerdo",
    tipo: "carne",
    momento: ["almuerzo", "cena"],
    precio: 150,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Salmon",
    tipo: "pescado",
    momento: ["almuerzo", "cena"],
    precio: 200,
    cantidadActual: 3,
    cantidadMinima: 1,
  },
  {
    nombre: "Manteca",
    tipo: "lacteo",
    momento: ["desayuno"],
    precio: 60,
    cantidadActual: 0,
    cantidadMinima: 2,
  },
  {
    nombre: "Lechuga",
    tipo: "verdura",
    momento: ["almuerzo", "cena"],
    precio: 40,
    cantidadActual: 5,
    cantidadMinima: 2,
  },
  {
    nombre: "Aceite",
    tipo: "verdura",
    momento: ["almuerzo", "cena"],
    precio: 100,
    cantidadActual: 1,
    cantidadMinima: 2,
  },
];

const recetas = [
  {
    nombre: "Ensalada de tomate",
    momento: "almuerzo",
    ingredientes: [
      { producto: productos[0], cantidad: 2 },
      { producto: productos[15], cantidad: 1 },
      { producto: productos[16], cantidad: 1 },
    ],
  },
  {
    nombre: "Ensalada de frutas",
    momento: "merienda",
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

export async function getProducts() {
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  return productos;
}

export async function getRecipes() {
  //   await new Promise((resolve) => setTimeout(resolve, 2000));
  return recetas;
}
