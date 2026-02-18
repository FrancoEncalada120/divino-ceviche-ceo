import { Insumo } from './insumo.model';
import { Unidad } from './unidad.model';
import { User } from './user.models';

export interface RecetaDetalle {
  receta_detalle_id: number;
  receta_id: number;
  insumo_id: number;
  unidad_id: number;

  cantidad: number;
  precio_actual: number;
  costo_linea?: number;

  insumo?: Insumo;
  unidad?: Unidad;

  created_at?: string | null;
  created_by?: User | null;
  updated_at?: string | null;
  updated_by?: User | null;
}
