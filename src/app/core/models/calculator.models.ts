export interface FixedCosts {
  rent: number;
  insurance: number;
  propertyTax: number;
  phoneInternet: number;
  marketing: number;
  licenses: number;
  utilities: number;
  salaries: number;
  otherFixed: number;
}

export interface VariableCosts {
  foodPct: number;
  laborPct: number;
  otherPct: number;
}

export interface SalesData {
  totalSales: number;
  avgTicket: number;
  days: number;
}

export interface ProfitResults {
  breakEvenSales: number;
  dailyBreakEven: number;
  ticketsPerDay: number;
  profit: number;
  profitMargin: number;
}


export interface ProfitRampRow {
  label: string;
  sales: number;
  profit: number;
  profitPct: number;
}
