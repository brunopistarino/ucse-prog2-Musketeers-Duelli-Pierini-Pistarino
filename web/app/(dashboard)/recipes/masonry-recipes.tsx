"use client";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";
import { Recipe } from "@/lib/zod-schemas";
import { getFoodstuffType, getMeal } from "@/lib/utils";

const columns = {
  600: 2,
  800: 3,
  1200: 4,
};

export default function MasonryRecipes({ recipes }: { recipes: Recipe[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null until the component is mounted
  if (!isMounted) return null;

  return (
    <ResponsiveMasonry columnsCountBreakPoints={columns} className="px-4 pb-4">
      <Masonry gutter="16px">
        {/* <div className="grid grid-cols-3 gap-4"> */}
        {recipes.map((recipe, x) => (
          <RecetaItem key={x} recipe={recipe} />
        ))}
        {/* </div> */}
      </Masonry>
    </ResponsiveMasonry>
  );
}

const RecetaItem = ({ recipe }: { recipe: Recipe }) => (
  <div className="bg-border p-1 rounded-lg">
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
  </div>
);
