"use server";

import { cookies } from "next/headers";
import { formatError } from "../utils";
import axios from "axios";
import { Recipe, recipeSchema } from "../zod-schemas";
import { revalidatePath } from "next/cache";

export async function getRecipes() {
  const cookieStore = cookies();
  try {
    const response = await axios.get(`${process.env.API_URL}recipes`, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data as Recipe[], error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function createRecipe(values: unknown) {
  const result = recipeSchema.safeParse(values);
  if (!result.success) return formatError(result.error);
  const cookieStore = cookies();

  try {
    const response = await axios.post(
      `${process.env.API_URL}recipes`,
      result.data,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    revalidatePath("/recipes");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function deleteRecipe(id: string) {
  const cookieStore = cookies();
  try {
    const response = await axios.delete(`${process.env.API_URL}recipes/${id}`, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    revalidatePath("/recipes");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

// export async function prepareRecipe(id: string) {
//   const cookieStore = cookies();
//   try {
//     const response = await axios.post(
//       `${process.env.API_URL}recipes/${id}/prepare`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
//       }
//     );
//     return { data: response.data, error: null };
//   } catch (error) {
//     return formatError(error);
//   }
// }
