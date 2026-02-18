import { RecetaDetalle } from './receta-detalle.model';
import { User } from './user.models';

export interface Receta {
  receta_id: number;
  nombre: string;
  descripcion: string | null;
  estado: string;

  detalles?: RecetaDetalle[];

  created_at?: string | null;
  created_by?: User | null;
  updated_at?: string | null;
  updated_by?: User | null;
}
