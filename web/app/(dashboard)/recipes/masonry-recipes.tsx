"use client";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";
import { Recipe } from "@/lib/zod-schemas";
import { getFoodstuffType, getMeal } from "@/lib/utils";
import RecipeItem from "./recipe-item";

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
          <RecipeItem key={x} recipe={recipe} />
        ))}
        {/* </div> */}
      </Masonry>
    </ResponsiveMasonry>
  );
}
