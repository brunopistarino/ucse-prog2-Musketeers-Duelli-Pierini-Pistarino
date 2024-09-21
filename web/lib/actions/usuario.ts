"use server";

import axios from "axios";
import { formatError, formatZodError } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "../zod-schemas";

export async function login(values: unknown) {
  const result = loginSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);

  try {
    const response = await axios.post(
      `${process.env.API_URL}usuario/login`,
      result.data
    );
    const token = response.headers.authorization;
    console.log(response.headers["expires-in"]);
    if (token) {
      const cookieStore = cookies();
      cookieStore.set("token", token, {
        httpOnly: true,
        maxAge: parseInt(response.headers["expires-in"], 10) / 1000,
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
    const response = await axios.post(
      `${process.env.API_URL}usuario/register`,
      result.data
    );

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
