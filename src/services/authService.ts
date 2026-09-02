// services/authService.ts
import axios from "axios";
import type { AuthResult, Role } from "../models/AuthModel";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request Interceptor: Otomatis menyematkan Bearer Token dari localStorage
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage (mengecek key 'token' atau 'access_token')
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function loginWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("api/v1/auth/login", { email, password });
  
  // Pastikan token disimpan ke localStorage saat login berhasil
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}
export async function getMe(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/api/v1/auth/me");
  return data;
}
export async function loginWithGoogle(idToken: string): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("api/v1/auth/google", { idToken });
  
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
}

// Tentukan tujuan redirect setelah login sukses, berdasarkan role user.
export function getRedirectPathByRole(role: Role, fallbackRedirectTo?: string): string {
  if (role === "Admin") {
    return "/dashboard/admin";
  }
  return fallbackRedirectTo ?? "/shopping";
}

export default api;
