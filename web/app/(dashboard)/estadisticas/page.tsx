"use client";

import ProductCategoryChart from "./product-category-chart";
import ProductTypeChart from "./product-type-chart";
import SpentChart from "./spent-chart";

export default function ChartsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Estadísticas</h1>
      </div>
      <div className="flex gap-4">
        <ProductCategoryChart />
        <ProductCategoryChart />
      </div>
      <SpentChart />
      <ProductTypeChart />
    </main>
  );
}
