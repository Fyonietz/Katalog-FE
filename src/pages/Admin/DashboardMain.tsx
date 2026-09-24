// src/pages/Admin/DashboardMain.tsx
import {
  ShieldCheck,
  ShoppingCart,
  Users,
  Package,
  CheckCircle2,
  Tags,
  ArrowRight,
  Banknote,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";
import StatCard from "../../components/StatCard";
import QuickActionCard from "../../components/QuickActionCard";
import { useDashboardAdminController } from "../../hooks/useDashboardAdminController";

const SETUP_STEPS = [
  { label: "Kategori Produk", done: true },
  { label: "Produk", done: true },
  { label: "Metode Pembayaran", done: false },
  { label: "Ongkos Kirim", done: false },
];

const rupiah = (value: number) => `Rp ${value.toLocaleString("id-ID")}`;

function formatJam(iso: string | null): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

export default function DashboardMain() {
  const navigate = useNavigate();
  const { stats, pesanan, salesSummary, salesPeriod, updatedAt, loading, error, nama } =
    useDashboardAdminController();

  const getPaymentBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Lunas</span>;
      case "pending": return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold">Pending</span>;
      case "unpaid": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Belum Bayar</span>;
      case "cancelled":
      case "expired":
      case "failed": return <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">Batal</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB]">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Topbar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4">
          <h1 className="text-lg font-bold text-[#1B2A6B]">Dashboard</h1>
        </div>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-2xl bg-[#1B2A6B] p-8 text-white">
            <div className="relative flex items-center justify-between gap-6 flex-wrap">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-[#AEB9E0]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Administrator Panel
                </span>
                <h2 className="mt-3 text-2xl font-bold">Selamat Datang, {nama}!</h2>
                <p className="mt-1 text-sm text-[#AEB9E0] max-w-md">
                  Kelola katalog produk, pantau pesanan masuk, dan manajemen pelanggan secara terpusat.
                </p>
              </div>

              <div className="rounded-xl bg-white/10 px-4 py-3 text-right">
                <p className="text-[10px] uppercase tracking-wide text-[#AEB9E0]">Data Diperbarui</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  {loading ? "Memuat..." : `Pukul ${formatJam(updatedAt)} WIB`}
                </p>
              </div>
            </div>
            <div className="absolute -bottom-16 -right-10 w-56 h-56 bg-[#2E9DF7] opacity-20 rounded-[3rem] rotate-12" />
          </div>

          {/* Stat cards — angka diambil langsung dari API */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <StatCard
              icon={Package}
              label="Total Produk"
              value={stats?.totalProduk ?? 0}
              loading={loading}
              actionLabel="Kelola"
              onAction={() => navigate("/dashboard/admin/produk/daftar")}
            />
            <StatCard
              icon={ShoppingCart}
              label="Total Pesanan"
              value={stats?.totalPesanan ?? 0}
              loading={loading}
              actionLabel="Kelola"
              onAction={() => navigate("/dashboard/admin/pesanan")}
            />
            <StatCard
              icon={Users}
              label="Total Pelanggan"
              value={stats?.totalPelanggan ?? 0}
              loading={loading}
            />
            <StatCard
              icon={Clock}
              label="Pesanan Pending"
              value={stats?.pesananPending ?? 0}
              loading={loading}
              hint="Belum dibayar"
            />
            <StatCard
              icon={Banknote}
              label="Pendapatan Bulan Ini"
              value={stats?.totalPendapatan ?? 0}
              loading={loading}
              format={rupiah}
              hint={
                salesSummary
                  ? `${salesSummary.paidOrders} pesanan lunas`
                  : salesPeriod
                    ? `Periode ${salesPeriod.startDate} s/d ${salesPeriod.endDate}`
                    : undefined
              }
            />
          </div>

          {/* Tabel Pesanan Masuk */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-base font-extrabold text-[#1B2A6B]">Pesanan Masuk Terbaru</h2>
              <button
                onClick={() => navigate("/dashboard/admin/pesanan")}
                className="flex items-center gap-1 text-xs font-bold text-[#2E9DF7] hover:text-[#1B2A6B]"
              >
                Lihat Semua
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-10 text-center text-gray-500 text-sm">Memuat data pesanan...</div>
              ) : error ? (
                <div className="p-10 text-center text-red-500 text-sm">{error}</div>
              ) : pesanan.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-sm">Belum ada pesanan yang masuk.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold">Order ID</th>
                      <th className="p-4 font-bold">Pelanggan</th>
                      <th className="p-4 font-bold">Total Harga</th>
                      <th className="p-4 font-bold">Pembayaran</th>
                      <th className="p-4 font-bold">Pengerjaan</th>
                      <th className="p-4 font-bold">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {pesanan.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-4 font-extrabold text-[#1B2A6B]">#{item.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-gray-800">{item.namaUser}</p>
                        </td>
                        <td className="p-4 font-bold text-gray-700">{rupiah(item.totalHarga)}</td>
                        <td className="p-4">{getPaymentBadge(item.paymentStatus)}</td>
                        <td className="p-4">
                          <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {item.statusPengerjaan}
                          </span>
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Aksi cepat + Panduan setup */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-[#1B2A6B]">Aksi & Pintasan Cepat</h3>
              <p className="text-sm text-gray-500 mt-0.5">Pilih menu di bawah untuk langsung menuju ke halaman pengelolaan data.</p>

              <div className="mt-4 grid sm:grid-cols-2 gap-3">
                <QuickActionCard
                  icon={Package}
                  title="Manajemen Produk"
                  description="Tambah produk atau import Excel"
                  to="/dashboard/admin/produk/daftar"
                />
                <QuickActionCard
                  icon={Tags}
                  title="Kategori Produk"
                  description="Kelola kategori katalog"
                  to="/dashboard/admin/produk/kategori"
                />
                <QuickActionCard
                  icon={ShoppingCart}
                  title="Pesanan"
                  description="Pantau dan proses pesanan masuk"
                  to="/dashboard/admin/pesanan"
                />
                <QuickActionCard
                  icon={Users}
                  title="Pelanggan"
                  description="Kelola data pelanggan"
                  to="/dashboard/admin/pelanggan"
                />
              </div>
            </div>

            {/* Panduan setup */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 flex flex-col">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-[#EAF2FE] flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-[#2E9DF7]" />
                </div>
                <h3 className="font-semibold text-[#1B2A6B]">Panduan Setup Katalog</h3>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1 text-xs text-gray-400">
                <span>Urutan:</span>
                {SETUP_STEPS.map((step, index) => (
                  <span key={step.label} className="flex items-center gap-1">
                    {step.label}
                    {index < SETUP_STEPS.length - 1 && <ArrowRight className="h-3 w-3" />}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {SETUP_STEPS.map((step) => (
                  <div
                    key={step.label}
                    className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                          step.done ? "bg-green-500" : "bg-gray-200"
                        }`}
                      >
                        {step.done && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </span>
                      {step.label}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        step.done ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.done ? "Selesai" : "Belum"}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
