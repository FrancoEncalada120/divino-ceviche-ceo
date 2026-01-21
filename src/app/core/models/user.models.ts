export interface User {
  user_id: number;
  user_name: string;
  user_apellido: string;
  user_password: string;
  user_estado: string;
  user_email: string;
  user_rol: number;
}

export interface UserRequest {
  email: string;
  password: string;
}

export interface UserResponse {
  token: string;
  user: User;
}
