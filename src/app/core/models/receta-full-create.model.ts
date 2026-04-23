export interface RecetaFullCreate {
  receta: {
    nombre: string;
    descripcion?: string | null;
    estado?: string;
    created_by?: number | null;
    updated_by?: number | null;
    porcenta_venta?: number;
    costo_preparacion?: number;
    costo_neto?: number;
    costo_total?: number;
    porciones?: number;
    imagen_url?: string | null;
    es_insumo?: boolean;
    unidad_receta?: number;
    cantidad_receta?: number;
  };
  detalles: {
    insumo_id: number;
    unidad_id: number;
    location_id: number;
    cantidad: number;
    precio_actual: number;
    porcenta_venta?: number;
    costo_preparacion?: number;
    costo_neto?: number;
    costo_total?: number;
    porcentaje_venta_old?: number;
    costo_neto_old?: number;
    costo_total_old?: number;
    imagen_url?: string | null;
    es_insumo?: boolean;
    unidad_receta?: number;
    cantidad_receta?: number | null;
    porciones?: number | null;
    created_by?: number | null;
    updated_by?: number | null;
  }[];
}
