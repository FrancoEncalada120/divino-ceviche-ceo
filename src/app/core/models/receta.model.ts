import { RecetaDetalle } from './receta-detalle.model';
import { User } from './user.models';

export interface Receta {
  receta_id: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  porciones: number;
  porcenta_venta: number;
  costo_preparacion: number;
  costo_neto: number;
  costo_total: number;

  porcentaje_venta_old: number;
  costo_neto_old: number;
  costo_total_old: number;

  detalles?: RecetaDetalle[];

  created_at?: string | null;
  created_by?: User | null;
  updated_at?: string | null;
  updated_by?: User | null;
}
