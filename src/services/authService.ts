// services/authService.ts
import axios from "axios";
import type { AuthResult, Role } from "../models/AuthModel";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export async function loginWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("api/v1/auth/login", { email, password });
  return data;
}

export async function loginWithGoogle(idToken: string): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("api/v1/auth/google", { idToken });
  return data;
}

// Tentukan tujuan redirect setelah login sukses, berdasarkan role user.
// redirectTo dari location.state (kalau user diarahkan ke sini gara-gara mau checkout)
// tetap diprioritaskan untuk role Pelanggan.
export function getRedirectPathByRole(role: Role, fallbackRedirectTo?: string): string {
  if (role === "Admin") {
    return "/dashboard/admin";
  }
  return fallbackRedirectTo ?? "/shopping";
}

export default api;
