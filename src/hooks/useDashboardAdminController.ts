 // hooks/useDashboardAdminController.ts
import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "../services/dashboardService";

export function useDashboardAdminController() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const nama = localStorage.getItem("nama") ?? "Admin";

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, nama };
}
