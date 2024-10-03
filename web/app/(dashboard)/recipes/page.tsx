import MasonryRecipes from "./masonry-recipes";
import { getRecipes } from "@/lib/actions/recipes";
import ErrorPage from "@/components/error-page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FormDialog from "./form-dialog";
import { getFoodstuffs } from "@/lib/actions/foodstuffs";
import NameFilter from "@/components/filters/name-filter";
import FoodstuffTypeFilter from "@/components/filters/foodstuff-type-filter";
import MealFilter from "@/components/filters/meal-filter";

interface Props {
  searchParams: {
    name: string;
    type: string;
    meal: string;
  };
}

export default async function RecipesPage({ searchParams }: Props) {
  const { name, type, meal } = searchParams;
  const [
    { data: recipes, error: recipesError },
    { data: foodstuffs, error: foodstuffsError },
  ] = await Promise.all([getRecipes(name, type, meal), getFoodstuffs()]);

  if (recipesError || !recipes || foodstuffsError || !foodstuffs) {
    const error = recipesError || foodstuffsError || "";
    return <ErrorPage error={error} />;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center px-6 py-4 justify-between sticky top-0 bg-card z-50 flex-col md:flex-row gap-2 overflow-x-auto">
        <h1 className="text-lg font-semibold md:text-2xl">Recetas</h1>
        <div className="flex gap-2 flex-col md:flex-row w-full md:w-auto">
          <NameFilter />
          <div className="flex gap-2">
            <FoodstuffTypeFilter />
            <MealFilter />
          </div>
          <FormDialog foodstuffs={foodstuffs}>
            <Button className="gap-2">
              <Plus size={16} />
              Agregar receta
            </Button>
          </FormDialog>
        </div>
      </div>
      <MasonryRecipes recipes={recipes} />
    </div>
  );
}
