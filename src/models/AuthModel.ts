// models/AuthModel.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: User;
}
