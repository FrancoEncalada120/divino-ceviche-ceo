import { Compra } from './compra.model';
import { CompraDetalle } from './compra-detalle.model';

export interface CompraFullResponse {
  compra: Compra;
  detalles: CompraDetalle[];
  total_compra: number;
}
