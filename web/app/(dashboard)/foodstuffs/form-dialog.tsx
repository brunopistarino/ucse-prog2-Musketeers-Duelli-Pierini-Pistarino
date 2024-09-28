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
import { Alimento } from "@/lib/zod-schemas";
import { MultiSelect } from "@/components/ui/multi-select";
import { Trash2 } from "lucide-react";
import { FoodstuffType, foodstuffsTypes, momentos } from "@/lib/constants";
import { useFoodstuffsForm } from "@/hooks/form/use-foodstuffs-form";
import { getFoodstuffType } from "@/lib/utils";
import FormInput from "@/components/form/form-input";

interface Props {
  children: React.ReactNode;
  alimento?: Alimento;
}

export default function FormDialog({ children, alimento }: Props) {
  const { form, isPending, isOpen, setIsOpen, onSubmit, onDelete } =
    useFoodstuffsForm(alimento);

  const momentosList = Object.keys(momentos).map((key) => ({
    value: key,
    label: momentos[key as keyof typeof momentos].label,
    icon: momentos[key as keyof typeof momentos].icon,
  }));

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
            <FormInput
              label="Nombre"
              placeholder="Tomate"
              control={form.control}
              name="name"
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
                      {Object.keys(foodstuffsTypes).map((key) => {
                        const foodstuffType = getFoodstuffType(
                          key as FoodstuffType
                        );
                        return (
                          <SelectItem key={key} value={key}>
                            {foodstuffType.emoji} {foodstuffType.name}
                          </SelectItem>
                        );
                      })}
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
            <FormInput
              label="Precio"
              placeholder="50.00"
              control={form.control}
              name="price"
              type="number"
            />
            <div className="flex gap-4">
              <FormInput
                label="Cantidad actual"
                placeholder="10"
                control={form.control}
                name="current_quantity"
                type="number"
                className="w-full"
              />
              <FormInput
                label="Cantidad mínima"
                placeholder="5"
                control={form.control}
                name="minimum_quantity"
                type="number"
                className="w-full"
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
