import { LineChart, Package, ShoppingCart, NotepadText } from "lucide-react";

export const pages = [
  {
    name: "Reports",
    href: "/reports",
    icon: LineChart,
  },
  {
    name: "Foodstuffs",
    href: "/foodstuffs",
    icon: Package,
  },
  {
    name: "Recipes",
    href: "/recipes",
    icon: NotepadText,
  },
  {
    name: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
  },
];

export const foodstuffsTypes = {
  Vegetable: {
    name: "Vegetable",
    emoji: "🥬",
    color: "hsl(var(--chart-1))",
  },
  Fruit: {
    name: "Fruit",
    emoji: "🍎",
    color: "hsl(var(--chart-2))",
  },
  Fish: {
    name: "Fish",
    emoji: "🐟",
    color: "hsl(var(--chart-3))",
  },
  Meat: {
    name: "Meat",
    emoji: "🥩",
    color: "hsl(var(--chart-4))",
  },
  Dairy: {
    name: "Dairy",
    emoji: "🥛",
    color: "hsl(var(--chart-5))",
  },
};

export const meals = {
  Breakfast: {
    name: "Breakfast",
    emoji: "🕕",
    color: "hsl(var(--chart-1))",
  },
  Lunch: {
    name: "Lunch",
    emoji: "🕛",
    color: "hsl(var(--chart-2))",
  },
  Supper: {
    name: "Supper",
    emoji: "🕒",
    color: "hsl(var(--chart-3))",
  },
  Dinner: {
    name: "Dinner",
    emoji: "🕘",
    color: "hsl(var(--chart-4))",
  },
};

export type FoodstuffType = keyof typeof foodstuffsTypes;
export type Meal = keyof typeof meals;
