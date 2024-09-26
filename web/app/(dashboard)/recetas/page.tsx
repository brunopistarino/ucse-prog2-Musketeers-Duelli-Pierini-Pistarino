import MasonryRecipes from "./masonry-recipes";
import ModeToggle from "@/components/mode-toggle";
import Filters from "./filters";
import { getRecipes } from "@/lib/actions/recipes";
import ErrorPage from "@/components/error-page";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import FormDialog from "./form-dialog";
import { getFoodstuffs } from "@/lib/actions/foodstuffs";

export default async function Page() {
  const [
    { data: recipes, error: recipesError },
    { data: foodstuffs, error: foodstuffsError },
  ] = await Promise.all([getRecipes(), getFoodstuffs()]);

  if (recipesError || !recipes || foodstuffsError || !foodstuffs) {
    const error = recipesError || foodstuffsError || "";
    return <ErrorPage error={error} />;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center px-6 py-4 justify-between sticky top-0 bg-card z-50">
        <h1 className="text-lg font-semibold md:text-2xl">Recetas</h1>
        <div className="flex gap-2">
          <Filters />
          {/* <Button className="gap-2">
            <DollarSign size={16} />
            Hacer compra
          </Button> */}
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
