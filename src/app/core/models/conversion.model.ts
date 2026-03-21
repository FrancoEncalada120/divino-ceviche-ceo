export interface RecConversion {
  id: number;
  insumo_id: number;
  unidad_origen_id: number;
  cantidad_origen: number;
  unidad_destino_id: number;
  cantidad_destino: number;
  created_at?: string;
  created_by?: number | string | null;
  updated_at?: string;
  updated_by?: number | string | null;

  insumo?: RecConversionInsumo | null;
  unidad_origen?: RecConversionUnidad | null;
  unidad_destino?: RecConversionUnidad | null;
  created_user?: RecConversionUser | null;
  updated_user?: RecConversionUser | null;
}

export interface RecConversionInsumo {
  insumo_id: number;
  nombre: string;
  descripcion: string;
  unidad_id?: number | null;
  cantidad?: number | null;
  grupo?: string | null;
  estado?: string | null;
}

export interface RecConversionUnidad {
  unidad_id: number;
  nombre: string;
  abreviatura: string;
  grupo?: string | null;
  estado?: string | null;
}

export interface RecConversionUser {
  user_id: number;
  user_name: string;
  user_email: string;
}

export interface RecConversionCreateRequest {
  insumo_id: number;
  unidad_origen_id: number;
  cantidad_origen: number;
  unidad_destino_id: number;
  cantidad_destino: number;
  created_by?: number | string | null;
}

export interface RecConversionUpdateRequest {
  insumo_id?: number;
  unidad_origen_id?: number;
  cantidad_origen?: number;
  unidad_destino_id?: number;
  cantidad_destino?: number;
  updated_by?: number | string | null;
}
