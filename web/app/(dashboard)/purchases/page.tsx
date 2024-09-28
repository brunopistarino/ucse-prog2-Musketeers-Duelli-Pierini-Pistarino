import { getFoodstuffsBelowMinimum } from "@/lib/actions/foodstuffs";
import ErrorPage from "@/components/error-page";
import ClientPage from "./client-page";

interface Props {
  searchParams: {
    name: string;
    type: string;
  };
}

export default async function Page({ searchParams }: Props) {
  const { name, type } = searchParams;
  const { data, error } = await getFoodstuffsBelowMinimum(name, type);

  if (error) return <ErrorPage error={error} />;

  return <ClientPage data={data} />;
}
