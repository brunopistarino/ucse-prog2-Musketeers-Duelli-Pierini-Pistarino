import { Recipe } from "@/lib/zod-schemas";
import { useToast } from "../use-toast";
import { useState } from "react";
import { deleteRecipe, prepareRecipe } from "@/lib/actions/recipes";

export default function useRecipeForm(recipe: Recipe) {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const onPrepare = async () => {
    setIsPending(true);
    const response = await prepareRecipe(recipe.id!);
    if (response?.error) {
      console.error(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Receta preparada",
      });
    }
    setIsPending(false);
  };

  const onDelete = async () => {
    setIsPending(true);
    const response = await deleteRecipe(recipe.id!);
    if (response?.error) {
      console.error(response.error);
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Receta eliminada",
      });
    }
    setIsPending(false);
  };

  return { isPending, onPrepare, onDelete } as const;
}
