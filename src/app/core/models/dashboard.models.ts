export type DateRangeKey = 'last7' | 'last30' | 'today';

export interface DashboardFilters {
  locationId: string; // "all" | "1" | ...
  range: DateRangeKey; // last7, last30, today
}

export interface KpiCard {
  key: 'netSales' | 'cogs' | 'labor' | 'prime' | 'aov' | 'netMargin';
  title: string;
  value: number;
  format: 'currency' | 'percent' | 'number';
  icon?: string; // bootstrap icon class
}

export interface DashboardResponse {
  hasMissingYesterday: boolean;
  kpis: KpiCard[];
  locations: { id: string; name: string }[];
}
