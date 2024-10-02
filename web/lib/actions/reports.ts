"use server";

import { axiosInstance, formatError, isAuthError } from "../utils";
import { cookies } from "next/headers";
import {
  MonthlyCostsReport,
  RecipeFoodstuffTypeReport,
  RecipeMealReport,
} from "../types";
import { redirect } from "next/navigation";

export async function getRecipeMealReports() {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.get("reports/recipe_meal", {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data as RecipeMealReport[], error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function getRecipeFoodstuffTypeReports() {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.get("reports/recipe_foodstuff_type", {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data as RecipeFoodstuffTypeReport[], error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}

export async function getMonthlyCostsReports() {
  const cookieStore = cookies();
  try {
    const response = await axiosInstance.get("reports/monthly_costs", {
      headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
    });
    return { data: response.data as MonthlyCostsReport[], error: null };
  } catch (error) {
    if (isAuthError(error)) {
      redirect("/login");
    }
    return formatError(error);
  }
}
