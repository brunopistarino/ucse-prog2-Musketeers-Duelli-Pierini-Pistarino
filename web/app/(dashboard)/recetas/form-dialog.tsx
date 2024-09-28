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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Meal, momentos } from "@/lib/constants";
import { Alimento, Recipe, recipeSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  children: React.ReactNode;
  recipe?: Recipe;
  foodstuffs: Alimento[];
}

export default function FormDialog({ children, recipe, foodstuffs }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: recipe?.name || "",
      meal: recipe?.meal || "",
      ingredients: recipe?.ingredients || [{ id: "", quantity: 1 }], // Start with quantity 1
    },
  });

  const handleOpen = () => {
    setIsOpen(true);
    form.reset();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const onSubmit = async (data: Recipe) => {
    // Filter out ingredients with quantity 0
    const filteredIngredients = data.ingredients.filter(
      (ingredient) => ingredient.quantity > 0
    );
    const updatedData = { ...data, ingredients: filteredIngredients };
    console.log(updatedData);
  };

  const allFormValues = form.watch(); // Watch all form values

  // Log form values each time they change
  useEffect(() => {
    console.log("Form values changed:", allFormValues);
  }, [allFormValues]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {recipe ? "Modificar" : "Agregar"} receta
          </AlertDialogTitle>
          <AlertDialogDescription>...</AlertDialogDescription>
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
                    <Input placeholder="Ensalada de atún" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Momento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger
                        className={field.value ? "" : "text-muted-foreground"}
                      >
                        <SelectValue placeholder="Elija un momento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(momentos).map((key) => {
                        const Icon = momentos[key as Meal].icon;

                        return (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              {momentos[key as Meal].label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* render one select for each ingredient with a numeric input for the quantity */}
            <div className="space-y-2">
              <FormLabel>Ingredientes</FormLabel>
              {form.watch("ingredients").map((ingredient, index) => (
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
                          {foodstuffs.map((foodstuff) => (
                            <SelectItem
                              key={foodstuff.id}
                              value={foodstuff.id!}
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
                        {/* <FormLabel>Cantidad</FormLabel> */}
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
                    variant="destructive"
                    onClick={() => {
                      form.setValue(
                        "ingredients",
                        form
                          .getValues("ingredients")
                          .filter((_, i) => i !== index)
                      );
                    }}
                  >
                    Eliminar
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                className="w-full"
                variant="outline"
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
