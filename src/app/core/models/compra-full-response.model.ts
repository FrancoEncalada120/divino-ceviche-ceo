import { Compra } from './compra.model';
import { CompraDetalle } from './compra-detalle.model';
import { Receta } from './receta.model';

export interface CompraFullResponse {
  compra: Compra;
  detalles: CompraDetalle[];
  total_compra: number;
  receta_impactada: Receta[]; // Nombres de recetas impactadas
}

export interface DeleteCompraResponse {
  message: string;
}
