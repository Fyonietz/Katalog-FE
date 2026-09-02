// models/AuthModel.ts
export interface UserProfile {
  id: number;
  nama: string;
  email: string;
  role?: string;
  noTelp?: string;
}
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
