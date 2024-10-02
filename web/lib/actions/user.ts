"use server";

import { axiosInstance, formatError, formatZodError } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "../zod-schemas";

export async function login(values: unknown) {
  const result = loginSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);

  try {
    const response = await axiosInstance.post("user/login", result.data);
    const token = response.headers.authorization;
    console.log(response.headers["expires-in"]);
    if (token) {
      const cookieStore = cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        maxAge: parseInt(response.headers["expires-in"], 10),
        path: "/",
      });
    }
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function register(values: unknown) {
  const result = registerSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);

  try {
    const response = await axiosInstance.post("user/register", result.data);

    const responseLogin = await login({
      username: result.data.email,
      password: result.data.password,
    });

    if (responseLogin.error) return responseLogin;
    return { data: response.data, error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.delete("token");
  redirect("/login");
}
