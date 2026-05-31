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

export interface InventoryPriceAlert {
  inventario_id: number;
  insumo_id: number;
  insumo_nombre: string;
  unidad_id: number;

  stock: string | number;
  inventario_desc: string | null;

  fecha_anterior: string;
  fecha_actual: string;

  precio_anterior: string | number;
  precio_actual: string | number;
  diferencia_precio: string | number;
  variacion_porcentaje: string | number;

  estado_precio: 'SUBIO' | 'BAJO' | 'IGUAL' | 'SIN_HISTORICO' | string;
  nivel_alerta: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA' | 'SIN_ALERTA' | string;

  alerta_mensaje: string;
}

export interface InventoryPriceAlertResponse {
  success: boolean;
  total: number;
  data: InventoryPriceAlert[];
  message?: string;
}
