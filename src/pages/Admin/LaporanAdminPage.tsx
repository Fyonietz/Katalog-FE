 // src/pages/Admin/LaporanAdminPage.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getSalesReport, type SalesReportResponse } from "../../services/reportService";

export default function LaporanAdminPage() {
  const [reportData, setReportData] = useState<SalesReportResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter State
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [period, setPeriod] = useState<string>("day");

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      // Panggil API GET /api/v1/reports/sales dengan query params[cite: 3]
      const data = await getSalesReport(startDate, endDate, period);
      setReportData(data);
      
      // Update filter input dengan rentang efektif dari backend (default backend)[cite: 3]
      if (!startDate) setStartDate(data.startDate);
      if (!endDate) setEndDate(data.endDate);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]); // Otomatis refresh jika periode (day/month/year) berubah

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
          <div>
            <h1 className="text-lg font-bold text-[#1B2A6B]">Laporan Penjualan</h1>
            <p className="text-xs text-gray-500">Ringkasan pendapatan dari pesanan yang lunas (Paid)[cite: 3].</p>
          </div>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-4">
            
            {/* Filter Section */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm shrink-0">
              <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-auto flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Mulai</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                  />
                </div>
                <div className="w-full md:w-auto flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal Akhir</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                  />
                </div>
                <div className="w-full md:w-auto flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Pengelompokan (Period)[cite: 3]</label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9DF7] cursor-pointer"
                  >
                    <option value="day">Harian (Day)</option>
                    <option value="month">Bulanan (Month)</option>
                    <option value="year">Tahunan (Year)</option>
                  </select>
                </div>
                <div className="w-full md:w-auto">
                  <button 
                    type="submit" 
                    className="w-full bg-[#1B2A6B] hover:bg-[#111A42] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-all"
                  >
                    Terapkan Filter
                  </button>
                </div>
              </form>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm font-medium">Mengkalkulasi laporan...</div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center text-red-500 text-sm font-medium">{error}</div>
            ) : reportData ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl">📦</div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Total Semua Pesanan</p>
                      <p className="text-2xl font-black text-[#1B2A6B]">{reportData.summary.totalOrders}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center text-xl">✅</div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase">Pesanan Lunas</p>
                      <p className="text-2xl font-black text-[#1B2A6B]">{reportData.summary.paidOrders}</p>
                    </div>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-white">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center text-xl">💰</div>
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase">Total Pendapatan</p>
                      <p className="text-2xl font-black text-emerald-700">Rp {reportData.summary.totalRevenue.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </div>

                {/* Data Table */}
                <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
                  <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-extrabold text-[#1B2A6B] text-sm">Rincian per {period === "day" ? "Hari" : period === "month" ? "Bulan" : "Tahun"}</h3>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {reportData.rows.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center p-10 h-full">
                        <p className="text-sm font-bold text-gray-700">Tidak ada data penjualan</p>
                        <p className="text-xs text-gray-500 mt-1">Belum ada pesanan aktif pada rentang tanggal ini[cite: 3].</p>
                      </div>
                    ) : (
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead className="sticky top-0 bg-white z-10 shadow-sm">
                          <tr className="text-gray-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-bold border-b border-gray-200">Periode</th>
                            <th className="p-4 font-bold border-b border-gray-200 text-center">Total Pesanan</th>
                            <th className="p-4 font-bold border-b border-gray-200 text-center">Pesanan Lunas</th>
                            <th className="p-4 font-bold border-b border-gray-200 text-right">Pendapatan</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100">
                          {reportData.rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                              <td className="p-4 font-extrabold text-[#1B2A6B]">
                                {row.period}
                              </td>
                              <td className="p-4 text-center font-bold text-gray-700">
                                {row.totalOrders}
                              </td>
                              <td className="p-4 text-center">
                                <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold border border-green-200">
                                  {row.paidOrders}
                                </span>
                              </td>
                              <td className="p-4 text-right font-black text-emerald-600">
                                Rp {row.revenue.toLocaleString("id-ID")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
}
