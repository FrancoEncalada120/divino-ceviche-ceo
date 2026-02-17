export interface RecetaFullCreate {
  receta: {
    nombre: string;
    descripcion?: string | null;
  };
  detalles: {
    insumo_id: number;
    unidad_id: number;
    cantidad: number;
    precio_actual: number;
  }[];
}
