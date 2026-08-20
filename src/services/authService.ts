// services/authService.ts
import axios from "axios";
import type { AuthResult } from "../models/AuthModel";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export async function loginWithPassword(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("/auth/login", { email, password });
  return data;
}

export function redirectToGoogleLogin(): void {
  window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google/login`;
}

export default api;
