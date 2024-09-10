import { z } from "zod";

export const alimentoFormSchema = z.object({
  nombre: z.string().min(1),
  tipo: z.string().min(1),
  momentos: z.array(z.string().min(1)).nonempty(),
  precio: z
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
  cantidad_actual: z.coerce.number().int(),
  cantidad_minima: z.coerce.number().int(),
});

export type Alimento = z.infer<typeof alimentoFormSchema>;
