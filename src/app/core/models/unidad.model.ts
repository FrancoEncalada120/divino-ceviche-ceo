import { User } from './user.models';

export interface Unidad {
  unidad_id: number;
  nombre: string;
  abreviatura: string;
  estado: string;

  created_at?: string | null;
  created_by?: User | null;
  updated_at?: string | null;
  updated_by?: User | null;
}
