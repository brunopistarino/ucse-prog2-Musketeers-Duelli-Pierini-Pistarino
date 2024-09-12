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
    href: "/alimentos",
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

export const alimentosTypes = {
  Verdura: "🥬 Verdura",
  Fruta: "🍎 Fruta",
  Pescado: "🐟 Pescado",
  Carne: "🥩 Carne",
  Lácteo: "🥛 Lácteo",
};

export type AlimentosType = keyof typeof alimentosTypes;

export const momentos = {
  Desayuno: {
    label: "Desayuno",
    icon: Clock6,
  },
  Almuerzo: {
    label: "Almuerzo",
    icon: Clock12,
  },
  Merienda: {
    label: "Merienda",
    icon: Clock3,
  },
  Cena: {
    label: "Cena",
    icon: Clock9,
  },
};

export type MomentosType = keyof typeof momentos;
