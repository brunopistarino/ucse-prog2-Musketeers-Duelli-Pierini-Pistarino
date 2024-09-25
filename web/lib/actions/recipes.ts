"use server";

import { cookies } from "next/headers";
import { formatError } from "../utils";
import axios from "axios";
import { Recipe } from "../zod-schemas";

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
