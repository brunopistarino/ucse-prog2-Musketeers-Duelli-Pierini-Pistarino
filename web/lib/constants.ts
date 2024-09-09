import {
  LineChart,
  Package,
  ShoppingCart,
  Users,
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
    name: "Productos",
    href: "/productos",
    icon: Package,
  },
  {
    name: "Recetas",
    href: "/recetas",
    icon: Users,
  },
  {
    name: "Compras",
    href: "/compras",
    icon: ShoppingCart,
  },
];

export const productTypes = {
  verdura: "🥬 Verdura",
  fruta: "🍎 Fruta",
  carne: "🥩 Carne",
  pescado: "🐟 Pescado",
  lacteo: "🥛 Lácteo",
};

export const moments = {
  desayuno: {
    label: "Desayuno",
    icon: Clock6,
  },
  almuerzo: {
    label: "Almuerzo",
    icon: Clock12,
  },
  merienda: {
    label: "Merienda",
    icon: Clock3,
  },
  cena: {
    label: "Cena",
    icon: Clock9,
  },
};
