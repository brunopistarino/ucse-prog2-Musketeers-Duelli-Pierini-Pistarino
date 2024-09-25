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
import { Alimento, alimentoFormSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MultiSelect } from "@/components/ui/multi-select";
import { Trash2 } from "lucide-react";
import { FoodstuffType, foodstuffsTypes, momentos } from "@/lib/constants";
import {
  createFoodstuff,
  deleteFoodstuff,
  updateFoodstuff,
} from "@/lib/actions/foodstuffs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  children: React.ReactNode;
  alimento?: Alimento;
}

export default function FormDialog({ children, alimento }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<Alimento>({
    resolver: zodResolver(alimentoFormSchema),
    defaultValues: {
      name: alimento?.name || "",
      type: alimento?.type || "",
      meals: alimento?.meals || [],
      price: alimento?.price,
      current_quantity: Number(alimento?.current_quantity) || undefined,
      minimum_quantity: Number(alimento?.minimum_quantity) || undefined,
    },
  });

  const momentosList = Object.keys(momentos).map((key) => ({
    value: key,
    label: momentos[key as keyof typeof momentos].label,
    icon: momentos[key as keyof typeof momentos].icon,
  }));

  async function onSubmit(values: Alimento) {
    setIsPending(true);
    const response = alimento
      ? await updateFoodstuff(values, alimento.id!)
      : await createFoodstuff(values);
    if (response?.error) {
      console.error(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Alimento ${alimento ? "modificado" : "agregado"}`,
      });
      if (!alimento) {
        form.reset();
      }
      setIsOpen(false);
    }
    setIsPending(false);
  }

  async function onDelete() {
    setIsPending(true);
    const response = await deleteFoodstuff(alimento?.id!);
    if (response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: `Alimento eliminado`,
      });
    }
    setIsPending(false);
    setIsOpen(false);
  }

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {alimento ? "Modificar" : "Agregar"} alimento
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
              name="name"
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
              name="type"
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
                      {Object.keys(foodstuffsTypes).map((key) => (
                        <SelectItem key={key} value={key}>
                          {foodstuffsTypes[key as FoodstuffType]}
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
              name="meals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Momentos</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={momentosList}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="50.00" type="number" {...field} />
                      {field.value && (
                        <p className="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground text-sm">
                          {new Intl.NumberFormat("es-AR", {
                            style: "currency",
                            currency: "ARS",
                          }).format(field.value)}
                        </p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="current_quantity"
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
                name="minimum_quantity"
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
              {alimento && (
                <Button
                  variant="destructive"
                  className="mr-auto gap-2 mt-2 sm:mt-0 w-full sm:w-auto"
                  disabled={isPending}
                  onClick={onDelete}
                >
                  <Trash2 size={16} />
                  Eliminar
                </Button>
              )}
              <AlertDialogCancel
                disabled={isPending}
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction type="submit" disabled={isPending}>
                Guardar
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
