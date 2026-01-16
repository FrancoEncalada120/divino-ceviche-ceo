import { Location } from './location.model';
import { User } from './user.models';

export interface DashboardResponse {
  success: boolean;
  invoices: Invoice[];
  dailyMetrics: DailyMetric[];
  totales: TotalMetric[];
}

export interface Invoice {
  invoice_id: number;
  invoice_date: string; // YYYY-MM-DD
  invoice_vendor_description: string;
  category_id: number;
  invoice_amount: string; // viene como string del backend
  invoice_notes: string | null;
  location_id: number;
  category: Category;
  locations: Location;
  invoice_create_user: string;
  created_at: string;
  invoice_update_user: string;
  update_at: string;
  created_user?: User;
  updated_user?: User;
}

export interface Category {
  category_id: number;
  invoice_type_id: number;
  description: string | null;
  category_code: string;
}

export interface DailyMetric {
  daily_metric_date: string;
  location_name: string;
  totalNetSales: string;
  totalDailyHourly: string;
  LaborCost: string;
  AOV: string;
}

export interface DailyMetricCreateDto {
  daily_metric_id?: number | null;
  location_id: number; // ✅ CORRECTO
  daily_metric_date: string; // YYYY-MM-DD
  daily_metric_tickets: number;
  daily_metric_net_sales: number;
  daily_metric_daily_hourly: number;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_user?: User;
  updated_user?: User;
}

export interface TotalMetric {
  name: string;
  goal: number;
  Result: number;
  diff: number;
  eval: Eval;
  icon: string;
  signo: string;
}

export interface Eval {
  color: string;
  arrow: string;
  status: string;
}
