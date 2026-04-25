export interface RecetaFullCreate {
  receta: {
    nombre: string;
    descripcion?: string | null;
    estado?: string;
    // ─── campos de location ───────────────────
    location_id?: number | null;
    todoslocales?: boolean; // si true, crea en todos los locales activos
    // ─── campos de rec_recetas_totales ────────
    porcenta_venta?: number;
    costo_preparacion?: number;
    costo_neto?: number;
    costo_total?: number;
    porciones?: number;
    imagen_url?: string | null;
    es_insumo?: boolean;
    // ─── auditoría ────────────────────────────
    created_by?: number | null;
    updated_by?: number | null;
  };
  detalles: {
    insumo_id: number;
    unidad_id: number;
    cantidad: number;
    precio_actual: number;
    unidad_receta?: number;
    cantidad_receta?: number | null;
    porciones?: number | null;
    created_by?: number | null;
    updated_by?: number | null;
  }[];
}
