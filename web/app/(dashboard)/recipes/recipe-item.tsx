"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { deleteRecipe } from "@/lib/actions/recipes";
import { getFoodstuffType, getMeal } from "@/lib/utils";
import { Recipe } from "@/lib/zod-schemas";
import { CookingPot, Trash2 } from "lucide-react";
import { useState } from "react";

export default function RecipeItem({ recipe }: { recipe: Recipe }) {
  const [isPending, setIsPending] = useState(false);
  const { toast } = useToast();

  const onPrepare = async () => {
    setIsPending(true);
    // Prepare recipe
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

  return (
    <div className="bg-border p-1 rounded-lg group">
      <div className="flex flex-col gap-2 border py-4 px-6 bg-card rounded-md">
        <h2 className="text-lg font-semibold">{recipe.name}</h2>
        <p className="text-sm text-muted-foreground">
          {getMeal(recipe.meal).name}
        </p>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center gap-2">
              <p className="shrink-0">
                {getFoodstuffType(ingredient.type!).emoji} {ingredient.name}
              </p>
              <div className="border-b w-full border-dashed border-gray-300" />
              <p className="font-mono">{ingredient.quantity}</p>
            </div>
          ))}
        </ul>
      </div>
      <div className="mt-1 flex md:hidden group-hover:flex">
        <Button
          variant="ghost"
          className="w-full gap-2"
          disabled={isPending}
          onClick={onDelete}
        >
          <Trash2 size={16} />
          Eliminar
        </Button>
        <Button
          variant="ghost"
          className="w-full gap-2"
          disabled={isPending}
          onClick={onPrepare}
        >
          <CookingPot size={16} />
          Preparar
        </Button>
      </div>
    </div>
  );
}
