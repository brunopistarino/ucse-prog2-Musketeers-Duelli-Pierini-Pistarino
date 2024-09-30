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
    color: "hsl(var(--chart-1))",
  },
  Fruit: {
    name: "Fruta",
    emoji: "🍎",
    color: "hsl(var(--chart-2))",
  },
  Fish: {
    name: "Pescado",
    emoji: "🐟",
    color: "hsl(var(--chart-3))",
  },
  Meat: {
    name: "Carne",
    emoji: "🥩",
    color: "hsl(var(--chart-4))",
  },
  Dairy: {
    name: "Lácteo",
    emoji: "🥛",
    color: "hsl(var(--chart-5))",
  },
};

export const meals = {
  Breakfast: {
    name: "Desayuno",
    emoji: "🕕",
    color: "hsl(var(--chart-1))",
  },
  Lunch: {
    name: "Almuerzo",
    emoji: "🕛",
    color: "hsl(var(--chart-2))",
  },
  Supper: {
    name: "Merienda",
    emoji: "🕒",
    color: "hsl(var(--chart-3))",
  },
  Dinner: {
    name: "Cena",
    emoji: "🕘",
    color: "hsl(var(--chart-4))",
  },
};

export type FoodstuffType = keyof typeof foodstuffsTypes;
export type Meal = keyof typeof meals;
