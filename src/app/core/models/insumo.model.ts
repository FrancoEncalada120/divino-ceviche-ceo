import { User } from './user.models';
import { Unidad } from './unidad.model';
import { GrupoDetalle } from './grupos.model';

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
  unidad_trabajo?: Unidad;
  cantidad: number;
  stock_ideal: number;
  stock: number;
  precio_final: number;
  grupo_detalle: GrupoDetalle[];
  estacion_id: Estacion;
  nombreCompleto: string; // Campo adicional para mostrar el nombre completo en la UI
  id_receta: number;
}

export interface Estacion {
  estacion_id: number;
  estacion_nombre: string;
  estacion_estado: string;
}

export interface CreateInsumoDto {
  nombre: string;
  descripcion: string;
  grupo?: string | null;
  proveedor_id?: number | null;
  estacion_id?: number | null;
  unidad_id?: number | null;
  unidad_trabajo?: number | null;
  cantidad?: number | null;
  stock_ideal?: number | null;
  created_by?: number | null;
  id_receta?: number | null;
}

export interface UpdateInsumoDto {
  nombre?: string;
  descripcion?: string | null;
  grupo?: string | null;
  proveedor_id?: number | null;
  estacion_id?: number | null;
  unidad_id?: number | null;
  unidad_trabajo?: number | null;
  cantidad?: number | null;
  stock_ideal?: number | null;
  estado?: 'A' | 'I';
  updated_by?: number | null;
}

export interface Proveedor {
  proveedor_id: number;
  nombre: string;
  ruc?: string | null;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  contacto?: string | null;
  estado?: string | null;
  created_at?: string | Date | null;
  created_by?: number | null;
  updated_at?: string | Date | null;
  updated_by?: number | null;
}

export interface CalcularPrecioRequest {
  insumo_id: number;
  unidad_receta: number;
  cantidad_receta: number;
  precio: number;
  unidad_id: number;
  cantidad: number;
}

export interface CalcularPrecioResponse {
  precio_calculado: number;
}
