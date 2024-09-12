import { getAlimentosBelowMinimum } from "@/lib/actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

import Filters from "./filters";
import ErrorPage from "@/components/error-page";

interface Props {
  searchParams: {
    name: string;
    type: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { name, type } = searchParams;
  // Usar un global state para guardar los productos seleccionados para comprar
  const { data, error } = await getAlimentosBelowMinimum(name, type);

  if (error) {
    return <ErrorPage error={error} />;
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex items-center px-6 py-4 justify-between border-b sticky top-0 bg-card z-50">
        <h1 className="text-lg font-semibold md:text-2xl">Compras</h1>
        <div className="flex gap-4">
          <Filters />
          <Button className="gap-2">
            <DollarSign size={16} />
            Hacer compra
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
