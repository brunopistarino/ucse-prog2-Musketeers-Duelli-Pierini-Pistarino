import { LineChart, Package, ShoppingCart, NotepadText } from "lucide-react";

export const pages = [
  {
    name: "Estadísticas",
    href: "/reports",
    icon: LineChart,
  },
  {
    name: "Alimentos",
    href: "/foodstuffs",
    icon: Package,
  },
  {
    name: "Recetas",
    href: "/recipes",
    icon: NotepadText,
  },
  {
    name: "Compras",
    href: "/purchases",
    icon: ShoppingCart,
  },
];

export const foodstuffsTypes = {
  Vegetable: {
    name: "Verdura",
    emoji: "🥬",
  },
  Fruit: {
    name: "Fruta",
    emoji: "🍎",
  },
  Fish: {
    name: "Pescado",
    emoji: "🐟",
  },
  Meat: {
    name: "Carne",
    emoji: "🥩",
  },
  Dairy: {
    name: "Lácteo",
    emoji: "🥛",
  },
};

export const meals = {
  Breakfast: {
    name: "Desayuno",
    emoji: "🕕",
  },
  Lunch: {
    name: "Almuerzo",
    emoji: "🕛",
  },
  Supper: {
    name: "Merienda",
    emoji: "🕒",
  },
  Dinner: {
    name: "Cena",
    emoji: "🕘",
  },
};

export type FoodstuffType = keyof typeof foodstuffsTypes;
export type Meal = keyof typeof meals;
