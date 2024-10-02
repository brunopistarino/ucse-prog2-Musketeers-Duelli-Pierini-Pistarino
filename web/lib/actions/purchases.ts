"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import {
  axiosInstance,
  formatError,
  formatZodError,
  isAuthError,
} from "../utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPruchase(values: unknown) {
  const result = z.array(z.string()).safeParse(values);
  if (!result.success) return formatZodError(result.error);
  const cookieStore = cookies();

  try {
    const response = await axiosInstance.post("purchases", result.data, {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    revalidatePath("/purchases");
    return { data: response.data, error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}
