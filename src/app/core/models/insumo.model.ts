import { User } from './user.models';
import { Unidad } from './unidad.model';
import { GrupoDetalle } from './grupos.model';

export interface Insumo {
  insumo_id: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  created_at?: string | null;
  created_by?: User;
  updated_at?: string | null;
  updated_by?: User;
  grupo: string;
  proveedor: Proveedor;
  unidad: Unidad;
  unidad_trabajo?: Unidad;
  cantidad: number;
  stock_ideal: number;
  stock: number;
  precio_final: number;
  grupo_detalle: GrupoDetalle[];
  estacion_id: Estacion;
  nombreCompleto: string;
  id_receta: number;
  frecuencia_inventario?: 'DIARIO' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL' | null;
  dia_inventario?:
    | 'LUNES'
    | 'MARTES'
    | 'MIERCOLES'
    | 'JUEVES'
    | 'VIERNES'
    | 'SABADO'
    | 'DOMINGO'
    | 'FIN_DE_MES'
    | null;
  ultima_toma_inventario?: string | null;
  es_inventariable?: boolean;
  location_id?: number | null;
}

export interface Estacion {
  estacion_id: number;
  estacion_nombre: string;
  estacion_estado: string;
}

export interface CreateInsumoDto {
  nombre: string;
  descripcion: string;
  grupo?: string | null;
  proveedor_id?: number | null;
  estacion_id?: number | null;
  unidad_id?: number | null;
  unidad_trabajo?: number | null;
  cantidad?: number | null;
  stock_ideal?: number | null;
  created_by?: number | null;
  id_receta?: number | null;
  precio_final?: number | null;
  stock?: number | null;
  frecuencia_inventario?: 'DIARIO' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL' | null;
  dia_inventario?:
    | 'LUNES'
    | 'MARTES'
    | 'MIERCOLES'
    | 'JUEVES'
    | 'VIERNES'
    | 'SABADO'
    | 'DOMINGO'
    | 'FIN_DE_MES'
    | null;
  ultima_toma_inventario?: string | Date | null;
  es_inventariable?: boolean | null;
  location_id?: number | null;
  todoslocales?: boolean | null;
}

export interface UpdateInsumoDto {
  nombre?: string;
  descripcion?: string | null;
  grupo?: string | null;
  proveedor_id?: number | null;
  estacion_id?: number | null;
  unidad_id?: number | null;
  unidad_trabajo?: number | null;
  cantidad?: number | null;
  stock_ideal?: number | null;
  frecuencia_inventario?: 'DIARIO' | 'SEMANAL' | 'QUINCENAL' | 'MENSUAL' | null;
  dia_inventario?:
    | 'LUNES'
    | 'MARTES'
    | 'MIERCOLES'
    | 'JUEVES'
    | 'VIERNES'
    | 'SABADO'
    | 'DOMINGO'
    | 'FIN_DE_MES'
    | null;
  ultima_toma_inventario?: string | Date | null;
  es_inventariable?: boolean | null;
  location_id?: number | null;
  estado?: 'A' | 'I';
  updated_by?: number | null;
}

export interface Proveedor {
  proveedor_id: number;
  nombre: string;
  ruc?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  contacto?: string | null;
  estado?: string | null;
  created_at?: string | Date | null;
  created_by?: number | null;
  updated_at?: string | Date | null;
  updated_by?: number | null;
}

export interface CalcularPrecioRequest {
  insumo_id: number;
  unidad_receta: number;
  cantidad_receta: number;
  precio: number;
  unidad_id: number;
  cantidad: number;
}

export interface CalcularPrecioResponse {
  precio_calculado: number;
}

export const GRUPOS_OPTIONS = [
  { label: 'Weight', value: 'WEIGHT' },
  { label: 'Volume', value: 'VOLUME' },
  { label: 'Unit', value: 'UNIT' },
  { label: 'Other', value: 'OTHER' },
];

export const ESTADO_OPTIONS = [
  { label: 'Active', value: 'A' },
  { label: 'Inactive', value: 'I' },
];

export const FRECUENCIA_INVENTARIO_OPTIONS = [
  { label: 'Daily', value: 'Daily' },
  { label: 'Weekly', value: 'Weekly' },
  { label: 'Biweekly', value: 'Biweekly' },
  { label: 'Monthly', value: 'Monthly' },
];

export const DIA_INVENTARIO_OPTIONS = [
  { label: 'Monday', value: 'Monday' },
  { label: 'Tuesday', value: 'Tuesday' },
  { label: 'Wednesday', value: 'Wednesday' },
  { label: 'Thursday', value: 'Thursday' },
  { label: 'Friday', value: 'Friday' },
  { label: 'Saturday', value: 'Saturday' },
  { label: 'Sunday', value: 'Sunday' },
  { label: 'End of Month', value: 'End of Month' },
];

export const INVENTARIABLE_OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];
