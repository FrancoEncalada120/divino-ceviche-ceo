import { CompraDetalle } from './compra-detalle.model';
import { User } from './user.models';

export interface Compra {
  compra_id: number;
  fecha: string | null;
  detalle: string | null;
  total: number;

  detalles?: CompraDetalle[];

  created_at?: string | null;
  created_by?: User | null;
  updated_at?: string | null;
  updated_by?: User | null;
}
