"use server";

import { cookies } from "next/headers";
import { formatError, formatZodError } from "../utils";
import axios from "axios";
import { Foodstuff, foodstuffSchema } from "../zod-schemas";
import { revalidatePath } from "next/cache";

export async function getFoodstuffs() {
  const cookieStore = cookies();
  try {
    const response = await axios.get(`${process.env.API_URL}foodstuffs`, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data as Foodstuff[], error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function getFoodstuffsBelowMinimum(name?: string, type?: string) {
  const cookieStore = cookies();
  try {
    const response = await axios.get(
      `${process.env.API_URL}foodstuffs/below_minimum`,
      {
        params: { name, type },
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function createFoodstuff(values: unknown) {
  const result = foodstuffSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);
  const cookieStore = cookies();

  try {
    const response = await axios.post(
      `${process.env.API_URL}foodstuffs`,
      result.data,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    revalidatePath("/foodstuffs");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function updateFoodstuff(values: unknown, id: string) {
  const result = foodstuffSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);
  const cookieStore = cookies();

  try {
    const response = await axios.put(
      `${process.env.API_URL}foodstuffs/${id}`,
      result.data,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    revalidatePath("/foodstuffs");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function deleteFoodstuff(id: string) {
  const cookieStore = cookies();
  try {
    const response = await axios.delete(
      `${process.env.API_URL}foodstuffs/${id}`,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    revalidatePath("/foodstuffs");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}
