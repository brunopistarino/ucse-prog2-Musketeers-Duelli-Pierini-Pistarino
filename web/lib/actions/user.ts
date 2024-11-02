"use server";

import { axiosInstance, formatError, formatZodError } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginSchema, registerSchema } from "../zod-schemas";
import axios from "axios";

export async function login(values: unknown) {
  const result = loginSchema.safeParse(values);
  if (!result.success) return formatZodError(result.error);

  try {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", result.data.username);
    formData.append("password", result.data.password);

    const response = await axios.post(
      "http://w230847.ferozo.com/tp_prog2/api/account/login",
      formData
    );

    const token = response.data.access_token;
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
    const formData = new URLSearchParams();
    formData.append("email", result.data.email);
    formData.append("password", result.data.password);
    formData.append("ConfirmPassword", result.data.confirm_password);
    formData.append("Role", "OPERADOR");

    const response = await axios.post(
      "http://w230847.ferozo.com/tp_prog2/api/account/register",
      formData
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
