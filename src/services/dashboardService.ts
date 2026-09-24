// services/dashboardService.ts
import { getProdukList } from "./produkService";
import { getAllPesanan, type PesananResponse } from "./pesananService";
import { getAllAlamat } from "./alamatService";
import { getSalesReport, type SalesReportSummary } from "./reportService";

export interface DashboardStats {
  totalProduk: number;
  totalPesanan: number;
  totalPelanggan: number;
  pesananPending: number;
  totalPendapatan: number;
}

export interface SalesPeriod {
  startDate: string;
  endDate: string;
}

export interface DashboardData {
  stats: DashboardStats;
  pesanan: PesananResponse[];
  salesSummary: SalesReportSummary | null;
  salesPeriod: SalesPeriod;
  updatedAt: string;
}

const STATUS_BELUM_DIBAYAR = ["unpaid", "pending"];

// "pending" = pembayaran dibuat tapi belum lunas, "unpaid" = belum ada transaksi.
function isBelumDibayar(status?: string): boolean {
  return STATUS_BELUM_DIBAYAR.includes((status ?? "").toLowerCase());
}

function formatTanggal(date: Date): string {
  const bulan = `${date.getMonth() + 1}`.padStart(2, "0");
  const tanggal = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${bulan}-${tanggal}`;
}

// Rentang default untuk kartu pendapatan: awal bulan berjalan s/d hari ini.
function getPeriodeBulanIni(): SalesPeriod {
  const now = new Date();
  return {
    startDate: formatTanggal(new Date(now.getFullYear(), now.getMonth(), 1)),
    endDate: formatTanggal(now),
  };
}

function getErrorMessage(err: unknown): string | null {
  if (err instanceof Error && err.message) return err.message;
  return null;
}

/**
 * Semua angka dashboard dihitung dari API, bukan konstanta:
 * - total produk    → GET /api/v1/products
 * - total pesanan   → GET /api/v1/pesanan/all (sekaligus daftar pesanan terbaru)
 * - total pelanggan → gabungan idUser dari /api/v1/alamat/all + /api/v1/pesanan/all
 * - pending         → pesanan dengan paymentStatus unpaid/pending
 * - pendapatan      → GET /api/v1/reports/sales (hanya pesanan lunas)
 */
export async function getDashboardData(): Promise<DashboardData> {
  const salesPeriod = getPeriodeBulanIni();

  const [produkRes, pesananRes, alamatRes, salesRes] = await Promise.allSettled([
    getProdukList(),
    getAllPesanan(),
    getAllAlamat(),
    getSalesReport(salesPeriod.startDate, salesPeriod.endDate, "month"),
  ]);

  // Daftar pesanan adalah inti dashboard — kalau gagal, tampilkan errornya.
  if (pesananRes.status === "rejected") {
    throw new Error(getErrorMessage(pesananRes.reason) ?? "Gagal memuat data pesanan.");
  }

  const produk = produkRes.status === "fulfilled" ? produkRes.value : [];
  const alamat = alamatRes.status === "fulfilled" ? alamatRes.value : [];
  const sales = salesRes.status === "fulfilled" ? salesRes.value : null;
  const pesanan = [...pesananRes.value].sort((a, b) => b.id - a.id);

  // Belum ada endpoint daftar user, jadi pelanggan dihitung dari idUser unik.
  const idPelanggan = new Set<number>();
  alamat.forEach((item) => {
    if (item?.idUser != null) idPelanggan.add(item.idUser);
  });
  pesanan.forEach((item) => {
    if (item?.idUser != null) idPelanggan.add(item.idUser);
  });

  return {
    stats: {
      totalProduk: produk.length,
      totalPesanan: pesanan.length,
      totalPelanggan: idPelanggan.size,
      pesananPending: pesanan.filter((item) => isBelumDibayar(item.paymentStatus)).length,
      totalPendapatan: sales?.summary?.totalRevenue ?? 0,
    },
    pesanan,
    salesSummary: sales?.summary ?? null,
    salesPeriod,
    updatedAt: new Date().toISOString(),
  };
}
