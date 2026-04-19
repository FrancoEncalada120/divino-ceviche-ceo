import { CompraDetalle } from './compra-detalle.model';
import { User } from './user.models';

export interface Compra {
  compra_id: number;
  compra_order_id: number;
  fecha: string | null;
  detalle: string | null;
  total: number;

  detalles: CompraDetalle[];
  order_detalles: CompraDetalle[];

  created_at?: string | null;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
  location_id: number;
  created_user: User | null;

  referencia_id?: string | null;
  compra_orden_referencia: string | null;
  compra_order_estado: number;

}
