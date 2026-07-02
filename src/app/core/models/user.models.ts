import { Location } from './location.model';

export interface User {
  user_id: number;
  user_name: string;
  user_apellido: string;
  user_password: string;
  user_estado: string;
  user_email: string;
  user_rol: number;
  location_id: number;
  location?: Location;

  cargo_id?: number | null;
  user_telefono?: string | null;
  user_documento?: string | null;
  user_direccion?: string | null;
  user_fecha_ingreso?: string | null;
  ext_code?: string | null;
  color?: string | null;
}

export interface UserRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  token: string;
  user: User;
}
