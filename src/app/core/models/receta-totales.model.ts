export interface RecetaTotales {
  receta_totales_id: number;
  receta_id: number;
  location_id: number;
  porcenta_venta: number | null;
  costo_preparacion: number | null;
  costo_neto: number | null;
  costo_total: number | null;
  porcentaje_venta_old: number | null;
  costo_neto_old: number | null;
  costo_total_old: number | null;
  imagen_url: string | null;
  es_insumo: boolean;
  porciones: number | null;
}
