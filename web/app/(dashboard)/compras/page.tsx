import { getAlimentosBelowMinimum } from "@/lib/actions";

export default async function Page() {
  const data = await getAlimentosBelowMinimum();

  return <p>Page</p>;
}
