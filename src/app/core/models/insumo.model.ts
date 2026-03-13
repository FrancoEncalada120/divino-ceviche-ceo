import { User } from './user.models';
import { Unidad } from './unidad.model';

export interface Insumo {
  insumo_id: number;
  nombre: string;
  descripcion: string | null;
  estado: string;
  created_at?: string | null;
  created_by?: User;
  updated_at?: string | null;
  updated_by?: User;
  grupo: string;
  proveedor: Proveedor;
  unidad: Unidad;
  cantidad: number;
  stock_ideal: number;
  stock: number;
}


export interface Proveedor {
  id: number;
  nombre: string;
}
