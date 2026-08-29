 // components/ProtectedRoute.tsx
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { Role } from "../models/AuthModel";
import { getRoleFromToken } from "../services/tokenService";

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const role = getRoleFromToken();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Login valid tapi role tidak diizinkan — lempar ke halaman sesuai role-nya
    return <Navigate to={role === "Admin" ? "/dashboard/admin" : "/shopping"} replace />;
  }

  return <>{children}</>;
}
