"use server";
import { cookies } from "next/headers";
import { formatError, formatZodError } from "../utils";
import axios from "axios";
import { alimentoFormSchema } from "../zod-schemas";
import { revalidatePath } from "next/cache";

const cookieStore = cookies();
const token = cookieStore.get("token");
const authHeader = { headers: { Authorization: `Bearer ${token?.value}` } };

export async function getAlimentos() {
  try {
    const response = await axios.get(
      `${process.env.API_URL}alimentos`,
      authHeader
    );
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function getAlimentosBelowMinimum(name?: string, type?: string) {
  try {
    const response = await axios.get(
      `${process.env.API_URL}alimentos/below_minimum`,
      {
        params: { name, type },
        ...authHeader,
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

  try {
    const response = await axios.post(
      `${process.env.API_URL}alimentos`,
      result.data,
      authHeader
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

  try {
    const response = await axios.put(
      `${process.env.API_URL}alimentos/${id}`,
      result.data,
      authHeader
    );
    revalidatePath("/alimentos");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function deleteAlimento(id: string) {
  try {
    const response = await axios.delete(
      `${process.env.API_URL}alimentos/${id}`,
      authHeader
    );
    revalidatePath("/alimentos");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}
