export interface RecetaFullCreate {
  receta: {
    nombre: string;
    descripcion?: string | null;
    porcenta_venta?: number;
    costo_preparacion?: number;
    costo_neto?: number;
    costo_total?: number;
    porciones: number;
    imagen_url?: string | null;
  };
  detalles: {
    insumo_id: number;
    unidad_id: number;
    cantidad: number;
    precio_actual: number;
  }[];
}
