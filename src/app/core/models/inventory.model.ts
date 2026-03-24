export interface Inventario {
  inventario_id: number;
  insumo_id: number;
  unidad_id: number;
  cantidad: number;
  precio: number;
  total: number;
  compra_id: number;
  stock: number;
  inventario_desc: string | null;
  inventario_fecha: string;
}
