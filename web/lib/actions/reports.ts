"use server";

import axios from "axios";
import { formatError } from "../utils";
import { cookies } from "next/headers";
import {
  MonthlyCostsReport,
  RecipeFoodstuffTypeReport,
  RecipeMealReport,
} from "../types";

export async function getRecipeMealReports() {
  const cookieStore = cookies();
  try {
    const response = await axios.get(
      `${process.env.API_URL}reports/recipe_meal`,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    return { data: response.data as RecipeMealReport[], error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function getRecipeFoodstuffTypeReports() {
  const cookieStore = cookies();
  try {
    const response = await axios.get(
      `${process.env.API_URL}reports/recipe_foodstuff_type`,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    return { data: response.data as RecipeFoodstuffTypeReport[], error: null };
  } catch (error) {
    return formatError(error);
  }
}

export async function getMonthlyCostsReports() {
  const cookieStore = cookies();
  try {
    const response = await axios.get(
      `${process.env.API_URL}reports/monthly_costs`,
      {
        headers: { Authorization: `Bearer ${cookieStore.get("token")?.value}` },
      }
    );
    return { data: response.data as MonthlyCostsReport[], error: null };
  } catch (error) {
    return formatError(error);
  }
}
