import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns, Product } from "./columns";
import { getProducts } from "@/lib/actions";
import FormSheet from "./form-sheet";
import { Plus } from "lucide-react";

export default async function ProductsPage() {
  const data = await getProducts();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center px-6 py-4 justify-between border-b sticky top-0 bg-card z-50">
        <h1 className="text-lg font-semibold md:text-2xl">Alimentos</h1>
        <FormSheet>
          <Button className="gap-2">
            <Plus size={16} />
            Agregar alimento
          </Button>
        </FormSheet>
      </div>
      {/* <EmptyState /> */}
      <DataTable columns={columns} data={data} />
    </div>
  );
}

const EmptyState = () => (
  <div
    x-chunk="An empty state showing no products with a heading, description and a call to action to add a product."
    className="flex flex-1 items-center justify-center"
  >
    <div className="flex flex-col items-center gap-1 text-center">
      <h3 className="text-2xl font-bold tracking-tight">No tenes productos</h3>
      <p className="text-sm text-muted-foreground">
        Agrega productos para empezar a hacer recetas.
      </p>
      {/* <Button className="mt-4">Add Product</Button> */}
    </div>
  </div>
);
