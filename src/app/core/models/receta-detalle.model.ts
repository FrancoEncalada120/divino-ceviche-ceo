import { Insumo } from './insumo.model';
import { Unidad } from './unidad.model';

export interface RecetaDetalle {
  receta_detalle_id: number;
  receta_id: number;
  insumo_id: number;
  unidad_id: number;
  location_id: number;

  insumo?: Insumo;
  unidad?: Unidad;

  cantidad: number;
  precio_actual: number;

  porcenta_venta?: number | null;
  costo_preparacion?: number | null;
  costo_neto?: number | null;
  costo_total?: number | null;

  porcentaje_venta_old?: number | null;
  costo_neto_old?: number | null;
  costo_total_old?: number | null;

  imagen_url?: string | null;
  es_insumo: boolean;
  unidad_receta: number;
  cantidad_receta?: number | null;
  porciones?: number | null;

  created_at?: string | null;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
}
