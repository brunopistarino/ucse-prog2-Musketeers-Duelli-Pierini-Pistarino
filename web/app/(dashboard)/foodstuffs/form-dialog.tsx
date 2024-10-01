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
import { Form } from "@/components/ui/form";
import { Foodstuff } from "@/lib/zod-schemas";
import { Trash2 } from "lucide-react";
import useFoodstuffsForm from "@/hooks/form/use-foodstuffs-form";
import { getFoodstuffTypes, getMeals } from "@/lib/utils";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
import FormMultiSelect from "@/components/form/form-multi-select";

interface Props {
  children: React.ReactNode;
  alimento?: Foodstuff;
}

export default function FormDialog({ children, alimento }: Props) {
  const { form, isPending, isOpen, setIsOpen, onSubmit, onDelete } =
    useFoodstuffsForm(alimento);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {alimento ? "Modificar alimento" : "Agregar alimento"}
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
            <FormSelect
              label="Tipo de alimento"
              placeholder="Elija un tipo de alimento"
              options={getFoodstuffTypes()}
              control={form.control}
              name="type"
            />
            <FormMultiSelect
              label="Momentos"
              placeholder="Elija un o varios momentos"
              options={getMeals()}
              control={form.control}
              name="meals"
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
