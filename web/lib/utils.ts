import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";
import { foodstuffsTypes, FoodstuffType } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(value);
}

export function getFoodstuffType(type: FoodstuffType) {
  const foodstuff = foodstuffsTypes[type as FoodstuffType];
  if (foodstuff) {
    return foodstuff;
  } else {
    return {
      name: type,
      emoji: "❓",
    };
  }
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
