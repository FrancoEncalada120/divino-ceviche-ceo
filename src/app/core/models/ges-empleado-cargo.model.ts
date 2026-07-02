import { User } from './user.models';
import { Location } from './location.model';
import { GesCargo } from './ges-cargo.model';

export interface GesEmpleadoTarifa {
  tarifa_id?: number;
  empleado_cargo_id?: number;
  tarifa_hora: number;
  tarifa_hora_extra: number;
  aplica_impuesto: boolean | number;
  porcentaje_impuesto: number;
  fecha_inicio: string;
  fecha_fin?: string | null;
  motivo?: string | null;
  estado?: string;
}

export interface GesEmpleadoCargo {
  empleado_cargo_id: number;
  user_id: number;
  cargo_id: number;
  location_id: number;
  estado: string;
  fecha_inicio: string;
  fecha_fin?: string | null;

  usuario?: User;
  cargo?: GesCargo;
  location?: Location;
  tarifas?: GesEmpleadoTarifa[];
}

export type CreateGesEmpleadoCargoDto = {
  user_id: number;
  cargo_id: number;
  location_id: number;
  fecha_inicio: string;
  fecha_fin?: string | null;

  tarifa_hora: number;
  tarifa_hora_extra: number;
  aplica_impuesto: boolean;
  porcentaje_impuesto: number;
  motivo?: string | null;
  created_by?: number | null;
};

export type UpdateGesEmpleadoCargoDto = {
  empleado_cargo_id: number;
  user_id?: number;
  cargo_id?: number;
  location_id?: number;
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string | null;
  updated_by?: number | null;
};

export type ChangeEmployeeRateDto = {
  tarifa_hora: number;
  tarifa_hora_extra: number;
  aplica_impuesto: boolean;
  porcentaje_impuesto: number;
  fecha_inicio: string;
  motivo?: string | null;
  updated_by?: number | null;
  created_by?: number | null;
};
