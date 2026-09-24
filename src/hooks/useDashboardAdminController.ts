// hooks/useDashboardAdminController.ts
import { useCallback, useEffect, useState } from "react";
import { getDashboardData, type DashboardStats, type SalesPeriod } from "../services/dashboardService";
import type { PesananResponse } from "../services/pesananService";
import type { SalesReportSummary } from "../services/reportService";
import { getMe } from "../services/authService";

export function useDashboardAdminController() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pesanan, setPesanan] = useState<PesananResponse[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesReportSummary | null>(null);
  const [salesPeriod, setSalesPeriod] = useState<SalesPeriod | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [nama, setNama] = useState<string>(localStorage.getItem("nama") ?? "Admin");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDashboardData();
      setStats(data.stats);
      setPesanan(data.pesanan);
      setSalesSummary(data.salesSummary);
      setSalesPeriod(data.salesPeriod);
      setUpdatedAt(data.updatedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init() {
      await refresh();
    }
    init();
  }, [refresh]);

  // Nama admin diambil dari profil (GET /api/v1/auth/me), bukan localStorage.
  useEffect(() => {
    let active = true;
    getMe()
      .then((profile) => {
        if (active && profile?.nama) setNama(profile.nama);
      })
      .catch(() => {
        /* tetap pakai nama fallback bila profil gagal dimuat */
      });
    return () => {
      active = false;
    };
  }, []);

  return { stats, pesanan, salesSummary, salesPeriod, updatedAt, nama, loading, error, refresh };
}
