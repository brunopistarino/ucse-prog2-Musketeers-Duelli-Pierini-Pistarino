"use client";
import { Button } from "@/components/ui/button";
import useRecipeForm from "@/hooks/form/use-recipe-form";
import { getFoodstuffType, getMeal } from "@/lib/utils";
import { Recipe } from "@/lib/zod-schemas";
import { CookingPot, Trash2 } from "lucide-react";

interface Props {
  recipe: Recipe;
}

export default function RecipeItem({ recipe }: Props) {
  const { isPending, onPrepare, onDelete } = useRecipeForm(recipe);

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
