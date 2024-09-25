import { getRecipes } from "@/lib/actions";
import MasonryRecipes from "./masonry-recipes";
import ModeToggle from "@/components/mode-toggle";
import Filters from "./filters";

export default async function Page() {
  // const data = await getRecipes();
  const data = [];

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
        </div>
      </div>
      <MasonryRecipes recipes={data} />
    </div>
  );
}
