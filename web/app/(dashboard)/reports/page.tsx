import {
  getMonthlyCostsReports,
  getRecipeFoodstuffTypeReports,
  getRecipeMealReports,
} from "@/lib/actions/reports";
import RecipeMealChart from "./recipe-meal-chart";
import MonthlyCostsChart from "./monthly-costs-chart";
import ErrorPage from "@/components/error-page";
import RecipeFoodstuffTypeChart from "./recipe-foodstuff-type-chart";

export default async function ReportsPage() {
  const [
    { data: recipeMealReportsData, error: recipeMealReportsError },
    {
      data: recipeFoodstuffTypeReportsData,
      error: recipeFoodstuffTypeReportsError,
    },
    { data: monthlyCostsReportsData, error: monthlyCostsReportsError },
  ] = await Promise.all([
    getRecipeMealReports(),
    getRecipeFoodstuffTypeReports(),
    getMonthlyCostsReports(),
  ]);

  if (
    recipeMealReportsError ||
    !recipeMealReportsData ||
    recipeFoodstuffTypeReportsError ||
    !recipeFoodstuffTypeReportsData ||
    monthlyCostsReportsError ||
    !monthlyCostsReportsData
  ) {
    const error =
      recipeMealReportsError ||
      recipeFoodstuffTypeReportsError ||
      monthlyCostsReportsError ||
      "";
    return <ErrorPage error={error} />;
  }

  return (
    <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Estadísticas</h1>
      </div>
      <div className="flex gap-4">
        <RecipeMealChart data={recipeMealReportsData} />
        <RecipeFoodstuffTypeChart data={recipeFoodstuffTypeReportsData} />
      </div>
      <MonthlyCostsChart data={monthlyCostsReportsData} />
    </div>
  );
}
