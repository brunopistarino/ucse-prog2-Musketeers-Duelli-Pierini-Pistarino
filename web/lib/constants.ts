import {
  LineChart,
  Package,
  ShoppingCart,
  NotepadText,
  Clock12,
  Clock3,
  Clock6,
  Clock9,
} from "lucide-react";

export const pages = [
  {
    name: "Estadísticas",
    href: "/estadisticas",
    icon: LineChart,
  },
  {
    name: "Alimentos",
    href: "/foodstuffs",
    icon: Package,
  },
  {
    name: "Recetas",
    href: "/recetas",
    icon: NotepadText,
  },
  {
    name: "Compras",
    href: "/compras",
    icon: ShoppingCart,
  },
];

export const foodstuffsTypes = {
  Vegetable: "🥬 Verdura",
  Fruit: "🍎 Fruta",
  Fish: "🐟 Pescado",
  Meat: "🥩 Carne",
  Dairy: "🥛 Lácteo",
};

export type FoodstuffType = keyof typeof foodstuffsTypes;

export const momentos = {
  Breakfast: {
    label: "Desayuno",
    icon: Clock6,
  },
  Lunch: {
    label: "Almuerzo",
    icon: Clock12,
  },
  Supper: {
    label: "Merienda",
    icon: Clock3,
  },
  Dinner: {
    label: "Cena",
    icon: Clock9,
  },
};

export type Meal = keyof typeof momentos;
