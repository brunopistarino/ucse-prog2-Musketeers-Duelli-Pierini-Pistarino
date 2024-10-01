"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { formatError, formatZodError } from "../utils";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function createPruchase(values: unknown) {
  const result = z.array(z.string()).safeParse(values);
  if (!result.success) return formatZodError(result.error);
  const cookieStore = cookies();

  try {
    const response = await axios.post(
      `${process.env.API_URL}purchases`,
      result.data,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    revalidatePath("/purchases");
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}
