import { Location } from './location.model';

export interface GesCargo {
  cargo_id: number;
  cargo_nombre: string;
  cargo_descripcion?: string | null;
  cargo_estado: string;
  location_id?: number | null;
  tarifa_hora: number;
  tarifa_hora_extra: number;
  created_at?: string | Date;
  created_by?: number | null;
  updated_at?: string | Date;
  updated_by?: number | null;

  location?: Location;
}
