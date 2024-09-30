import { useState } from "react";
import { useToast } from "../use-toast";
import { useForm } from "react-hook-form";
import { Recipe, recipeSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRecipe } from "@/lib/actions/recipes";

export default function useRecipesForm() {
  const [isPending, setIsPending] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<Recipe>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      ingredients: [{ id: "", quantity: 1 }],
    },
  });

  const onSubmit = async (data: Recipe) => {
    setIsPending(true);
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

  return { form, isPending, isOpen, setIsOpen, onSubmit } as const;
}
