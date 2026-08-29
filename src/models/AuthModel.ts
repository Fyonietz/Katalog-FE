// models/AuthModel.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export type Role = "Admin" | "Pelanggan";

export interface AuthResult {
  token: string;
  role: Role;
  nama: string;
  refreshToken: string;
}
