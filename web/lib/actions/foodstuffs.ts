"use server";

import { cookies } from "next/headers";
import {
  axiosInstance,
  formatError,
  formatZodError,
  isAuthError,
} from "../utils";
import { Foodstuff, foodstuffSchema } from "../zod-schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getFoodstuffs() {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.get("foodstuffs", {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data as Foodstuff[], error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function getFoodstuffsBelowMinimum(name?: string, type?: string) {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.get("foodstuffs/below_minimum", {
      params: { name, type },
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function createFoodstuff(values: unknown) {
  const result = foodstuffSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.post("foodstuffs", result.data, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    revalidatePath("/foodstuffs");
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function updateFoodstuff(values: unknown, id: string) {
  const result = foodstuffSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.put(`foodstuffs/${id}`, result.data, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    revalidatePath("/foodstuffs");
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function deleteFoodstuff(id: string) {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.delete(`foodstuffs/${id}`, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    revalidatePath("/foodstuffs");
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}
