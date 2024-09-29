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
import { createRecipe } from "@/lib/actions/recipes";
import { Meal, momentos } from "@/lib/constants";
import { Alimento, Recipe, recipeSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleMinus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  children: React.ReactNode;
  foodstuffs: Alimento[];
}

export default function FormDialog({ children, foodstuffs }: Props) {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      meal: "",
      ingredients: [{ id: "", quantity: 1 }],
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
    setIsPending(true);
    // Filter out ingredients with quantity 0
    const filteredIngredients = data.ingredients.filter(
      (ingredient) => ingredient.quantity > 0
    );
    const updatedData = { ...data, ingredients: filteredIngredients };
    const response = await createRecipe(updatedData);
    if (response?.error) {
      console.error(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Receta agregada",
      });
      form.reset();
      setIsOpen(false);
    }
    setIsPending(false);
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
          <AlertDialogTitle>Agregar receta</AlertDialogTitle>
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
                                  !selectedIngredients.includes(foodstuff.id) ||
                                  foodstuff.id === ingredient.id
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
