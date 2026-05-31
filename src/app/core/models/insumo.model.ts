import { User } from './user.models';
import { Unidad } from './unidad.model';
import { GrupoDetalle } from './grupos.model';

export interface Insumo {
  insumo_id: number;
  nombre: string;
  descripcion: string;
  estado: string;
  grupo: string;
  // ─── Campos base ──────────────────────────────────────────
  proveedor_id?: number | null;
  estacion_id?: number | null;
  unidad_id?: number | null;
  unidad_trabajo?: number | null;
  es_inventariable: boolean;
  cantidad_insumo?: number | null;
  id_receta?: number | null;
  created_at?: string | null;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
  nombreCompleto?: string;

  // ─── Relaciones ───────────────────────────────────────────
  unidad?: Unidad;
  unidadTrabajo?: Unidad;
  proveedor?: Proveedor;
  estacion?: Estacion;
  created_user?: User;
  updated_user?: User;
  grupo_detalle?: GrupoDetalle[];

  // ─── Detalle por location (stock, precios, inventario) ────
  insumos_detalles?: InsumoDetalle[];
}

export interface InsumoDetalle {
  detalle_id: number;
  insumo_id: number;
  location_id: number;
  stock: number;
  precio_final: number;
  stock_ideal?: number | null;
  frecuencia_inventario?: string | null;
  dia_inventario?: string | null;
  ultima_toma_inventario?: string | null;
  created_at?: string | null;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;

  // ─── Relaciones ───────────────────────────────────────────
  location?: Location;
}

export interface Estacion {
  estacion_id: number;
  estacion_nombre: string;
  estacion_estado: string;
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

// ─── Create ───────────────────────────────────────────────────
export interface CreateInsumoDto {
  // rec_insumos (base)
  nombre: string;
  descripcion: string;
  grupo?: string | null;
  proveedor_id?: number | null;
  estacion_id?: number | null;
  unidad_id?: number | null;
  unidad_trabajo?: number | null;
  cantidad_insumo?: number | null;
  es_inventariable?: boolean | null;
  id_receta?: number | null;
  created_by?: number | null;

  // rec_insumos_detalle (stock e inventario por location)
  stock?: number | null;
  precio_final?: number | null;
  stock_ideal?: number | null;
  frecuencia_inventario?: string | null;
  dia_inventario?: string | null;
  ultima_toma_inventario?: string | Date | null;

  // control de locations
  location_id?: number | null;
  todoslocales?: boolean | null;
}

// ─── Update ───────────────────────────────────────────────────
export interface UpdateInsumoDto {
  // rec_insumos (base)
  nombre?: string | null;
  descripcion?: string | null;
  grupo?: string | null;
  proveedor_id?: number | null;
  estacion_id?: number | null;
  unidad_id?: number | null;
  unidad_trabajo?: number | null;
  cantidad_insumo?: number | null;
  es_inventariable?: boolean | null;
  id_receta?: number | null;
  estado?: 'A' | 'I';
  updated_by?: number | null;

  // rec_insumos_detalle (stock e inventario por location)
  precio_final?: number | null;
  stock_ideal?: number | null;
  frecuencia_inventario?: string | null;
  dia_inventario?: string | null;
  ultima_toma_inventario?: string | Date | null;

  // obligatorio para saber qué detalle actualizar
  location_id: number;
}

// ─── Update Stock ─────────────────────────────────────────────
export interface UpdateStockInsumoDto {
  cantidad: number;
  location_id: number;
  updated_by?: number | null;
}

// ─── Responses ────────────────────────────────────────────────
export type CreateInsumoResponse = {
  insumo: Insumo;
  detalles: InsumoDetalle[];
};

export type UpdateInsumoResponse = {
  insumo: Insumo;
  detalle: InsumoDetalle | null;
};

// ─── Query params ─────────────────────────────────────────────
export interface GetInsumosParams {
  text?: string;
  bGrupo?: number;
  dia_inventario?: string;
  frecuencia_inventario?: string;
  location_id?: number;
}

// ─── Misc ─────────────────────────────────────────────────────
export interface CalcularPrecioRequest {
  insumo_id: number;
  unidad_receta: number;
  cantidad_receta: number;
  precio: number;
  unidad_id: number;
  cantidad: number;
  location_id: number;
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
  { label: 'Not defined', value: null },
  { label: 'Daily', value: 'DAILY' },
  { label: 'Weekly', value: 'WEEKLY' },
  { label: 'Biweekly', value: 'BIWEEKLY' },
  { label: 'Monthly', value: 'MONTHLY' },
  { label: 'On Demand', value: 'ON_DEMAND' },
];

export const DIA_INVENTARIO_OPTIONS = [
  { label: 'Not defined', value: null },
  { label: 'Everyday', value: 'EVERYDAY' },
  { label: 'Monday', value: 'MONDAY' },
  { label: 'Tuesday', value: 'TUESDAY' },
  { label: 'Wednesday', value: 'WEDNESDAY' },
  { label: 'Thursday', value: 'THURSDAY' },
  { label: 'Friday', value: 'FRIDAY' },
  { label: 'Saturday', value: 'SATURDAY' },
  { label: 'Sunday', value: 'SUNDAY' },
  { label: 'End of Month', value: 'END_OF_MONTH' },
];

export const INVENTARIABLE_OPTIONS = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

export interface StockCriticalItem {
  insumo_id: number;
  insumo_nombre: string;
  grupo: string | null;

  proveedor_id: number | null;
  proveedor_nombre: string | null;

  unidad_id: number | null;
  unidad_nombre: string | null;
  unidad_abreviatura: string | null;

  detalle_id: number;
  location_id: number;
  location_name: string;

  stock_actual: string | number;
  stock_ideal: string | number;
  precio_final: string | number;

  frecuencia_inventario: string | null;
  dia_inventario: string | null;
  ultima_toma_inventario: string | null;

  cantidad_faltante: string | number;
  valor_faltante: string | number;
  porcentaje_cobertura: string | number;

  estado_stock: 'SIN_STOCK' | 'BAJO_MINIMO' | 'OK' | 'SIN_STOCK_IDEAL' | string;

  nivel_riesgo:
    | 'CRITICO'
    | 'ALTO'
    | 'MEDIO'
    | 'BAJO'
    | 'SIN_CONFIGURAR'
    | string;

  estado_inventario: 'SIN_TOMA' | 'VENCIDO' | 'ACTUALIZADO' | string;

  dias_sin_toma: number | null;
}

export interface StockCriticalKpis {
  total_productos: number;
  productos_sin_stock: number;
  productos_bajo_minimo: number;
  productos_stock_ok: number;
  productos_sin_stock_ideal: number;
  inventario_vencido: number;
  valor_faltante_total: number;
  porcentaje_saludable: number;
  riesgo_general: 'ALTO' | 'MEDIO' | 'BAJO' | string;
}

export interface StockCriticalDashboardData {
  kpis: StockCriticalKpis;

  productos_criticos: StockCriticalItem[];
  productos_sin_stock: StockCriticalItem[];
  productos_bajo_minimo: StockCriticalItem[];
  productos_ok: StockCriticalItem[];
  productos_sin_stock_ideal: StockCriticalItem[];
  inventario_vencido: StockCriticalItem[];

  all: StockCriticalItem[];
}
