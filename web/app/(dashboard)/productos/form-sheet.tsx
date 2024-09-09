"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { alimentoFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productTypes } from "@/lib/constants";
import { MultiSelect } from "@/components/ui/multi-select";
import { Clock12, Clock3, Clock6, Clock9, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "./columns";
import { use, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  product?: Product;
}

export default function FormSheet({ children, product }: Props) {
  const form = useForm<z.infer<typeof alimentoFormSchema>>({
    resolver: zodResolver(alimentoFormSchema),
    defaultValues: {
      nombre: product?.nombre || "",
      tipo: product?.tipo || "",
      momentos: product?.momento || [],
      precio: Number(product?.precio) || undefined,
      cantidad_actual: Number(product?.cantidadActual) || undefined,
      cantidad_minima: Number(product?.cantidadMinima) || undefined,
    },
  });

  console.log(product);

  function onSubmit(values: z.infer<typeof alimentoFormSchema>) {
    console.log(values);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {product ? "Modificar" : "Agregar"} alimento
          </AlertDialogTitle>
          <AlertDialogDescription>
            Los alimentos son usados para crear recetas y llevar registro de su
            cantidad en stock.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Tomate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de alimento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={field.value ? "" : "text-muted-foreground"}
                      >
                        <SelectValue placeholder="Elija un tipo de alimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(productTypes).map((key) => (
                        <SelectItem key={key} value={key}>
                          {productTypes[key as keyof typeof productTypes]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="momentos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Momentos</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={momentsList}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Elija un o varios momentos"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="50.00" type="number" {...field} />
                      <p className="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground text-sm">
                        {new Intl.NumberFormat("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        }).format(field.value)}
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="cantidad_actual"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Cantidad actual</FormLabel>
                    <FormControl>
                      <Input placeholder="10" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cantidad_minima"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Cantidad mínima</FormLabel>
                    <FormControl>
                      <Input placeholder="5" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter className="pt-4">
              {product && (
                <Button variant="destructive" className="mr-auto gap-2">
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              )}
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              {/* <AlertDialogAction>Continue</AlertDialogAction> */}
              <Button type="submit">Guardar</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const momentsList = [
  { value: "desayuno", label: "Desayuno", icon: Clock6 },
  { value: "almuerzo", label: "Almuerzo", icon: Clock12 },
  { value: "merienda", label: "Merienda", icon: Clock3 },
  { value: "cena", label: "Cena", icon: Clock9 },
];
