"use client";

import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useEffect, useState } from "react";
import { Recipe } from "@/lib/zod-schemas";
import RecipeItem from "./recipe-item";

const columns = {
  600: 1,
  800: 2,
  1200: 3,
  1400: 4,
};

export default function MasonryRecipes({ recipes }: { recipes: Recipe[] }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <ResponsiveMasonry columnsCountBreakPoints={columns} className="px-4 pb-4">
      <Masonry gutter="16px">
        {recipes.map((recipe, x) => (
          <RecipeItem key={x} recipe={recipe} />
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}
