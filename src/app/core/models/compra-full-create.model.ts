export interface CompraFullCreate {
  compra: {
    fecha?: string | null;
    detalle?: string | null;
  };
  detalles: {
    insumo_id: number;
    unidad_id: number;
    cantidad: number;
    precio: number;
  }[];
}
