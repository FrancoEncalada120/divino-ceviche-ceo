import { Location } from "./location.model";

export interface MovimientoAgrupado {
  fecha: Date; //
  locations: Location[];
  conceptos: Concepto[];
  detalle: Detalle[];
  expanded?: boolean; // Agrega esta propiedad para controlar la expansión
}

export interface Detalle {
  location_id: number;
  location_name: string;

  tipo_col_id: number;
  tipo_col_name: string;

  conceptos: Concepto[];
  locations: Concepto[]
}


export interface Concepto {
  concepto_id: number;
  nombre: string;
  orden: number;
  concepto_accion: '+' | '-' | '='; // tipado pro 🔥
  total: number;
}


export interface cashConcepto {

  concepto_id: number;
  concepto_nombre: string;
  tipo_id: number;
  concepto_orden: number;
  concepto_accion: string;
  concepto_codigo: string;

}
