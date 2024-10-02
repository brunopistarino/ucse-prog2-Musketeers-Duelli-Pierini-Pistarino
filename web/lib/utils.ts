import axios, { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { foodstuffsTypes, FoodstuffType, Meal, meals } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

export function getFoodstuffType(value: FoodstuffType) {
  const foodstuff = foodstuffsTypes[value as FoodstuffType];
  if (foodstuff) {
    return foodstuff;
  } else {
    return {
      name: value,
      emoji: "❓",
      color: "hsl(var(--chart-1))",
    };
  }
}

export function getMeal(value: Meal) {
  const meal = meals[value];
  if (meal) {
    return meal;
  } else {
    return {
      name: value,
      emoji: "❓",
      color: "hsl(var(--chart-1))",
    };
  }
}

export function getFoodstuffTypes() {
  return Object.keys(foodstuffsTypes).map((key) => {
    const foodstuffType = getFoodstuffType(key as FoodstuffType);
    return {
      value: key,
      name: foodstuffType.name,
      emoji: foodstuffType.emoji,
      color: foodstuffType.color,
    };
  });
}

export function getMeals() {
  return Object.keys(meals).map((key) => {
    const meal = getMeal(key as Meal);
    return {
      value: key,
      name: meal.name,
      emoji: meal.emoji,
      color: meal.color,
    };
  });
}

export function formatError(error: unknown) {
  let errorMessage = "";
  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      const { msg } = error.response.data;
      if (Array.isArray(msg)) {
        errorMessage = msg
          .map((m: any) => `${m.msg_id} - ${m.description}`)
          .join(" | ");
      } else {
        errorMessage = error.response.data.message || error.message;
      }
    } else {
      errorMessage = error.message;
    }
  } else {
    errorMessage = "Se produjo un error inesperado";
  }
  return {
    data: null,
    error: errorMessage,
  };
}

export function formatZodError(error: ZodError) {
  let errorMessage = "";
  error.issues.forEach((issue: any) => {
    errorMessage += issue.message + " | ";
  });
  return {
    data: null,
    error: errorMessage,
  };
}

export const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
});

export function isAuthError(error: unknown): boolean {
  return error instanceof AxiosError && error.response?.status === 401;
}
