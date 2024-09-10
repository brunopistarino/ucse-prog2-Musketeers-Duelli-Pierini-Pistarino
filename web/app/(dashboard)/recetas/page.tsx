import { getRecipes } from "@/lib/actions";
import MasonryRecipes from "./masonry-recipes";
import ModeToggle from "@/components/mode-toggle";

export default async function Page() {
  const data = await getRecipes();

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Recetas</h1>
      </div>
      <MasonryRecipes recipes={data} />
    </div>
  );
}
