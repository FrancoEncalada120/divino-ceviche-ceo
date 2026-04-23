import { RecetaDetalle } from './receta-detalle.model';

export interface Receta {
  receta_id: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  detalles?: RecetaDetalle[];
  created_at?: string | null;
  created_by?: number | null;
  updated_at?: string | null;
  updated_by?: number | null;
}
