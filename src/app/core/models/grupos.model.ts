import { Insumo } from "./insumo.model";

export interface DataResponse {
  insumos: Insumo[];
  grupos: Grupo[];
}

export interface Grupo {
  grupo_id: number;
  grupo_nombre: string;
  created_at: string;
  created_by: number;
  updated_at?: string | null;
  updated_by?: number | null;

  detalles: GrupoDetalle[];
}


export interface GrupoDetalle {
  grupo_id: number;
  insumo_id: number;

  grupo_default: number;
  grupo_ultima_comrpa: number;

  insumo: Insumo;
}
