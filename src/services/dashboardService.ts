 // services/dashboardService.ts

export interface DashboardStats {
  totalProduk: number;
  totalPesanan: number;
  totalPelanggan: number;
  pesananPending: number;
}

const DUMMY_STATS: DashboardStats = {
  totalProduk: 12,
  totalPesanan: 34,
  totalPelanggan: 21,
  pesananPending: 5,
};

export async function getDashboardStats(): Promise<DashboardStats> {
  // Endpoint asli: const { data } = await api.get<DashboardStats>("/admin/dashboard/stats"); return data;
  await new Promise((resolve) => setTimeout(resolve, 300));
  return DUMMY_STATS;
}
