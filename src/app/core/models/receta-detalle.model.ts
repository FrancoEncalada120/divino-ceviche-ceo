import { Insumo } from "./insumo.model";
import { Unidad } from "./unidad.model";

export interface RecetaDetalle {
  receta_detalle_id: number;
  receta_id: number;
  insumo_id: number;
  unidad_id: number;
  location_id: number;
  cantidad: number;
  precio_actual: number;
  unidad_receta: number;
  cantidad_receta: number | null;
  created_at: string | null;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;

  insumo?: Insumo;
  unidad?: Unidad;
}
