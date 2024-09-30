"use client";
import FormInput from "@/components/form/form-input";
import FormSelect from "@/components/form/form-select";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRecipesForm from "@/hooks/form/use-recipes-form";
import { getMeals } from "@/lib/utils";
import { Alimento } from "@/lib/zod-schemas";
import { CircleMinus, Plus } from "lucide-react";

interface Props {
  children: React.ReactNode;
  foodstuffs: Alimento[];
}

export default function FormDialog({ children, foodstuffs }: Props) {
  const { form, isPending, isOpen, setIsOpen, onSubmit } = useRecipesForm();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Agregar receta</AlertDialogTitle>
          <AlertDialogDescription>...</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              label="Nombre"
              placeholder="Ensalada de atún"
              control={form.control}
              name="name"
            />
            <FormSelect
              label="Momento"
              placeholder="Elija un momento"
              options={getMeals()}
              control={form.control}
              name="meal"
            />

            {/* render one select for each ingredient with a numeric input for the quantity */}
            <div className="space-y-2">
              <FormLabel>Ingredientes</FormLabel>
              {form.watch("ingredients").map((ingredient, index) => {
                const selectedIngredients = form
                  .watch("ingredients")
                  .map((ing) => ing.id);

                return (
                  <div key={index} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.id`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={
                                field.value ? "" : "text-muted-foreground"
                              }
                            >
                              <SelectValue placeholder="Elija un alimento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {foodstuffs
                              .filter(
                                (foodstuff) =>
                                  !selectedIngredients.includes(
                                    foodstuff.id ?? ""
                                  ) || foodstuff.id === ingredient.id
                              ) // Filter out selected items, but allow the current one
                              .map((foodstuff) => (
                                <SelectItem
                                  key={foodstuff.id}
                                  value={foodstuff.id!}
                                  disabled={
                                    !foodstuff.meals.includes(
                                      form.getValues("meal")
                                    )
                                  }
                                >
                                  {foodstuff.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`ingredients.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="number"
                              min={0}
                              {...field}
                              value={field.value || 1} // Ensure initial value is 1
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0 text-muted-foreground hover:text-red-500"
                      onClick={() => {
                        form.setValue(
                          "ingredients",
                          form
                            .getValues("ingredients")
                            .filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <CircleMinus />
                    </Button>
                  </div>
                );
              })}
              <Button
                type="button"
                className="w-full"
                variant="outline"
                disabled={
                  form.watch("ingredients").length === foodstuffs.length
                }
                onClick={() =>
                  form.setValue("ingredients", [
                    ...form.getValues("ingredients"),
                    {
                      id: "",
                      quantity: 1,
                    },
                  ])
                }
              >
                <Plus className="text-muted-foreground mr-1" size={16} />
                Añadir ingrediente
              </Button>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={isPending}
                onClick={() => setIsOpen(false)}
              >
                Cancel
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
