export interface RecipeMealReport {
  type_of_use: string;
  count: number;
}

export interface RecipeFoodstuffTypeReport {
  type_of_foodstuff: string;
  count: number;
}

export interface MonthlyCostsReport {
  month: string;
  average_cost: number;
}
