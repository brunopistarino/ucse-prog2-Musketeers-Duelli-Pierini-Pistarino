import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
