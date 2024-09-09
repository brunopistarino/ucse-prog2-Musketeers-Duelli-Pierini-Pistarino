import Dashboard from "@/components/dashboard-02";
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns, Product } from "./columns";
import { getProducts } from "@/lib/actions";

export default async function ProductsPage() {
  const data = await getProducts();

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Productos</h1>
      </div>
      {/* <EmptyState /> */}
      <DataTable columns={columns} data={data} />
    </main>
  );
}

const EmptyState = () => (
  <div
    x-chunk="An empty state showing no products with a heading, description and a call to action to add a product."
    className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
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
