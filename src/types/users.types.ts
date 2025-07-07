export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface CreateUserRequest {
  nombre: string;
  email: string;
  password: string;
  rol?: string;
}

export interface UpdateUserRequest {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: string;
}