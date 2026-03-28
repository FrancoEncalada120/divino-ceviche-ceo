import { Insumo } from './insumo.model';
import { Unidad } from './unidad.model';
import { User } from './user.models';

export interface CompraDetalle {
  detalle_id: number;
  compra_id: number;
  insumo_id: number;
  unidad_id: number;

  cantidad: number;
  precio: number;
  total: number;

  insumo?: Insumo;
  unidad?: Unidad;
  grupo_id: number;

  created_at?: string | null;
  created_by?: User | null;
  updated_at?: string | null;
  updated_by?: User | null;
}
