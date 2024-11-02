import { z } from "zod";
import { foodstuffsTypes, FoodstuffType, Meal, meals } from "./constants";

export const FoodstuffTypeEnum = z.enum(
  Object.keys(foodstuffsTypes) as [FoodstuffType]
);
export const MealEnum = z.enum(Object.keys(meals) as [Meal]);

export const foodstuffSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: FoodstuffTypeEnum,
  meals: z.array(MealEnum).nonempty(),
  price: z
    .union([
      z.coerce
        .string()
        .regex(/^-?0$|^-?[1-9]\d*(\.\d+)?$/, {
          message: "Price is required",
        })
        .transform(Number),
      z.literal(0),
    ])
    .refine((v) => v >= 0, { message: "El precio no puede ser negativo" }),
  current_quantity: z.coerce.number().int(),
  minimum_quantity: z.coerce.number().int(),
});

export const recipeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  meal: MealEnum,
  ingredients: z.array(
    z.object({
      id: z.string().min(1),
      name: z.string().optional(),
      type: FoodstuffTypeEnum.optional(),
      quantity: z.coerce.number().int(),
    })
  ),
});

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .regex(/[A-Z]/, {
        message:
          "Password must contain at least one uppercase letter ('A'-'Z')",
      })
      .regex(/[a-z]/, {
        message:
          "Password must contain at least one lowercase letter ('a'-'z')",
      })
      .regex(/\d/, {
        message: "Password must contain at least one digit ('0'-'9')",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirm_password: z
      .string()
      .min(1, { message: "Please confirm the password" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export type Foodstuff = z.infer<typeof foodstuffSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
