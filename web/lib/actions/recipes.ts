"use server";

import { cookies } from "next/headers";
import { axiosInstance, formatError, isAuthError } from "../utils";
import { Recipe, recipeSchema } from "../zod-schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getRecipes(name?: string, type?: string, meal?: string) {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.get("recipes", {
      params: { name, type, meal },
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data as Recipe[], error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function createRecipe(values: unknown) {
  const result = recipeSchema.safeParse(values);
  if (!result.success) return formatError(result.error);
  const cookieStore = cookies();

  try {
    const response = await axiosInstance.post("recipes", result.data, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    revalidatePath("/recipes");
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function deleteRecipe(id: string) {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.delete(`recipes/${id}`, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    revalidatePath("/recipes");
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function prepareRecipe(id: string) {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.post(
      `recipes/repeated/${id}`,
      {},
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    revalidatePath("/recipes");
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}
