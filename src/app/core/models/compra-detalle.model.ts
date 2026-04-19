import { Compra } from './compra.model';
import { Insumo } from './insumo.model';
import { Unidad } from './unidad.model';

export interface CompraDetalle {
  detalle_id: number;
  compra_id: number;
  compra_order_id: number;
  insumo_id: number;
  unidad_id: number;

  cantidad: number; // o string si no transformas
  precio: number;
  total: number;

  grupo_id: number;

  insumo?: Insumo;
  unidad?: Unidad;
  compra?: Compra;
  compra_order?: Compra;
}
