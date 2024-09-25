"use server";
import { cookies } from "next/headers";
import { formatError, formatZodError } from "../utils";
import axios from "axios";
import { alimentoFormSchema } from "../zod-schemas";
import { revalidatePath } from "next/cache";

export async function getAlimentos() {
  const cookieStore = cookies();
  try {
    const response = await axios.get(`${process.env.API_URL}foodstuffs`, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function getAlimentosBelowMinimum(name?: string, type?: string) {
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

export async function createAlimento(values: unknown) {
  const result = alimentoFormSchema.safeParse(values);
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
    revalidatePath("/alimentos");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function updateAlimento(values: unknown, id: string) {
  const result = alimentoFormSchema.safeParse(values);
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
    revalidatePath("/alimentos");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function deleteAlimento(id: string) {
  const cookieStore = cookies();
  try {
    const response = await axios.delete(
      `${process.env.API_URL}foodstuffs/${id}`,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    revalidatePath("/alimentos");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}
