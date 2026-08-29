// services/tokenService.ts
import { jwtDecode } from "jwt-decode";
import type { Role } from "../models/AuthModel";

// ASP.NET ClaimsIdentity pakai URI ini sebagai key claim role,
// bukan "role" biasa.
const ROLE_CLAIM_KEY = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

interface JwtClaims {
  [ROLE_CLAIM_KEY]: Role;
  exp: number;
  [key: string]: unknown;
}

export function getRoleFromToken(): Role | null {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    const claims = jwtDecode<JwtClaims>(token);
    if (claims.exp * 1000 < Date.now()) return null; // token sudah expired
    return claims[ROLE_CLAIM_KEY] ?? null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getRoleFromToken() !== null;
}
