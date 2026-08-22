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
  const { data } = await api.post<AuthResult>("/api/v1/auth/login", { email, password });
  return data;
}

export async function loginWithGoogle(idToken: string): Promise<AuthResult> {
  const { data } = await api.post<AuthResult>("/api/v1/auth/google", { idToken });
  return data;
}

export default api;
