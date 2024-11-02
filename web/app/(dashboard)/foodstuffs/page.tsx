import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getFoodstuffs } from "@/lib/actions/foodstuffs";
import FormDialog from "./form-dialog";
import { Plus } from "lucide-react";
import ErrorPage from "@/components/error-page";

export default async function ProductsPage() {
  const { data, error } = await getFoodstuffs();

  if (error || !data) return <ErrorPage error={error} />;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center px-6 py-4 justify-between border-b sticky top-0 bg-card z-50">
        <h1 className="text-lg font-semibold md:text-2xl">Foodstuffs</h1>
        <FormDialog>
          <Button className="gap-2">
            <Plus size={16} />
            Add Foodstuff
          </Button>
        </FormDialog>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
