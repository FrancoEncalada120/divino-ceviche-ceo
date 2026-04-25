import { RecetaDetalle } from './receta-detalle.model';
import { RecetaTotales } from './receta-totales.model';

export interface Receta {
  receta_id: number;
  nombre: string;
  descripcion: string | null;
  estado: 'A' | 'I' | null;
  created_at: string | null;
  created_by: number | null;
  updated_at: string | null;
  updated_by: number | null;
  detalles: RecetaDetalle[];
  totales: RecetaTotales[];
}
