import { Location } from "./location.model";

export interface Goal {
  goal_id: number;
  goal_month: number;
  goal_year: number;
  location_id: number;
  goal_target_sales: number;
  goal_target_AOV: number;
  goal_food_cost: number;
  goal_labor_cost: number;
  goal_net_margin: number;
  locations: Location;
  goal_marketing: number;
  goal_loan: number;
  goal_repairs: number;
  goal_app_fee: number;
  goal_unassigned: number;
}
