import { z } from "zod";

export const alimentoFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  type: z.string().min(1),
  meals: z.array(z.string().min(1)).nonempty(),
  price: z
    .union([
      z.coerce
        .string()
        .regex(/^-?0$|^-?[1-9]\d*(\.\d+)?$/, {
          message: "El precio es obligatorio",
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
  meal: z.string().min(1),
  ingredients: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
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
    email: z.string().email({ message: "El email no es válido" }),
    password: z
      .string()
      .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
      .regex(/[A-Z]/, {
        message:
          "La contraseña debe contener al menos una letra mayúscula ('A'-'Z')",
      })
      .regex(/[a-z]/, {
        message:
          "La contraseña debe contener al menos una letra minúscula ('a'-'z')",
      })
      .regex(/\d/, {
        message: "La contraseña debe contener al menos un dígito ('0'-'9')",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "La contraseña debe contener al menos un carácter especial",
      }),
    confirm_password: z.string().min(1, { message: "Repita la contraseña" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Las contraseñas no coinciden",
    path: ["confirm_password"],
  });

export type Alimento = z.infer<typeof alimentoFormSchema>;
export type Recipe = z.infer<typeof recipeSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
