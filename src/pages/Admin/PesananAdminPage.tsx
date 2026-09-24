// src/pages/Admin/PesananAdminPage.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAllPesanan, updateStatusPengerjaan, type PesananResponse } from "../../services/pesananService";

interface StatusPengerjaan {
  id: number;
  nama: string;
}

export default function PesananAdminPage() {
  const [pesananList, setPesananList] = useState<PesananResponse[]>([]);
  const [statusList, setStatusList] = useState<StatusPengerjaan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("Semua");
  const [activeTab, setActiveTab] = useState<string>("Semua");

  // State Modal
  const [selectedPesanan, setSelectedPesanan] = useState<PesananResponse | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<number | "">("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";

  // Data Tabs sesuai master terbaru
  const TABS = ["Semua", "Menunggu Konfirmasi", "Konfirmasi", "Proses", "Selesai", "Dibatalkan"];

  useEffect(() => {
    fetchData();
    fetchMasterStatus();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPesanan();
      const sorted = data.sort((a, b) => b.id - a.id);
      setPesananList(sorted);
    } catch (err: any) {
      setError(err.message || "Gagal memuat pesanan pelanggan.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/status-pengerjaan`);
      if (res.ok) {
        const data = await res.json();
        setStatusList(data);
      }
    } catch (err) {
      console.error("Gagal memuat master status pengerjaan", err);
    }
  };

  useEffect(() => {
    if (selectedPesanan) {
      setSelectedStatusId(selectedPesanan.idStatusPengerjaan || "");
    }
  }, [selectedPesanan]);

  const handleUpdateStatus = async () => {
    if (!selectedPesanan || selectedStatusId === "") return;
    setIsUpdatingStatus(true);
    try {
      await updateStatusPengerjaan(selectedPesanan.id, Number(selectedStatusId));
      alert("Status pengerjaan berhasil diubah!");
      setSelectedPesanan(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status pengerjaan.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // --- LOGIKA FILTERING ---
  // 1. Filter Pencarian & Pembayaran terlebih dahulu
  const baseFiltered = pesananList.filter(pesanan => {
    const matchPayment = paymentFilter === "Semua" || pesanan.paymentStatus?.toLowerCase() === paymentFilter.toLowerCase();
    
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      pesanan.id.toString().includes(searchLower) ||
      pesanan.namaUser.toLowerCase().includes(searchLower) ||
      pesanan.alamat.toLowerCase().includes(searchLower);

    return matchPayment && matchSearch;
  });

  // 2. Terapkan Tab Status Pengerjaan pada hasil filter di atas
  const finalPesanan = baseFiltered.filter(pesanan => {
    if (activeTab === "Semua") return true;
    return pesanan.statusPengerjaan?.toLowerCase() === activeTab.toLowerCase();
  });

  // --- UI BADGES ---
  const getPaymentBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase">Lunas</span>;
      case "pending": return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>;
      case "unpaid": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Unpaid</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase">{status}</span>;
    }
  };

  const getPengerjaanBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "menunggu konfirmasi": return "bg-orange-50 text-orange-600 border-orange-200";
      case "konfirmasi": return "bg-blue-50 text-blue-600 border-blue-200";
      case "proses": return "bg-indigo-50 text-indigo-600 border-indigo-200";
      case "selesai": return "bg-green-50 text-green-700 border-green-200";
      case "dibatalkan": return "bg-gray-100 text-gray-600 border-gray-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (Tetap di atas) */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
          <div>
            <h1 className="text-lg font-bold text-[#1B2A6B]">Manajemen Pesanan</h1>
            <p className="text-xs text-gray-500">Kelola dan pantau antrean pesanan yang masuk.</p>
          </div>
          <button 
            onClick={fetchData}
            className="text-xs font-bold bg-blue-50 text-[#2E9DF7] hover:bg-[#2E9DF7] hover:text-white px-4 py-2 rounded-lg transition-colors"
          >
            ↻ Refresh Data
          </button>
        </div>

        {/* Konten Utama - Flex Column pembatas Tinggi */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-4">
            
            {/* Alat Filter & Pencarian (Shrink 0 agar tidak menyusut) */}
            <div className="shrink-0 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Pencarian */}
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Cari ID Pesanan, Nama, atau Alamat..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#2E9DF7] focus:ring-1 focus:ring-[#2E9DF7] transition-all shadow-sm"
                  />
                </div>
                {/* Filter Pembayaran */}
                <div className="w-full sm:w-48 shrink-0">
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm font-bold text-gray-700 bg-white rounded-xl border border-gray-200 outline-none focus:border-[#2E9DF7] cursor-pointer shadow-sm"
                  >
                    <option value="Semua">Semua Pembayaran</option>
                    <option value="paid">Lunas (Paid)</option>
                    <option value="unpaid">Belum Bayar (Unpaid)</option>
                    <option value="pending">Menunggu (Pending)</option>
                  </select>
                </div>
              </div>

              {/* TABS NAVIGASI */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {TABS.map((tab) => {
                  const count = tab === "Semua" 
                    ? baseFiltered.length 
                    : baseFiltered.filter(p => p.statusPengerjaan?.toLowerCase() === tab.toLowerCase()).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                        activeTab === tab 
                          ? "bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-md" 
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {tab}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* TABEL INNER SCROLL */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 text-sm font-medium">Memuat data pesanan...</div>
              ) : error ? (
                <div className="flex-1 flex items-center justify-center text-red-500 text-sm font-medium">{error}</div>
              ) : finalPesanan.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📭</span>
                  </div>
                  <p className="text-sm font-bold text-gray-700">Data Tidak Ditemukan</p>
                  <p className="text-xs text-gray-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter tab Anda.</p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto relative">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm">
                      <tr className="text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold border-b border-gray-200">Order ID / Tgl</th>
                        <th className="p-4 font-bold border-b border-gray-200">Pelanggan & Alamat</th>
                        <th className="p-4 font-bold border-b border-gray-200">Total Harga</th>
                        <th className="p-4 font-bold border-b border-gray-200">Status Bayar</th>
                        <th className="p-4 font-bold border-b border-gray-200">Status Pengerjaan</th>
                        <th className="p-4 font-bold border-b border-gray-200">Ringkasan Item</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {finalPesanan.map((pesanan) => (
                        <tr 
                          key={pesanan.id} 
                          onClick={() => setSelectedPesanan(pesanan)}
                          className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                        >
                          <td className="p-4 align-top">
                            <p className="font-extrabold text-[#1B2A6B]">#{pesanan.id}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(pesanan.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </td>
                          <td className="p-4 align-top">
                            <p className="font-bold text-gray-800">{pesanan.namaUser}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 max-w-[220px] leading-relaxed">
                              {pesanan.alamat}
                            </p>
                          </td>
                          <td className="p-4 font-bold text-[#2E9DF7] align-top">
                            Rp {pesanan.totalHarga.toLocaleString("id-ID")}
                          </td>
                          <td className="p-4 align-top">
                            {getPaymentBadge(pesanan.paymentStatus)}
                          </td>
                          <td className="p-4 align-top">
                            <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide border ${getPengerjaanBadge(pesanan.statusPengerjaan)}`}>
                              {pesanan.statusPengerjaan}
                            </span>
                          </td>
                          <td className="p-4 align-top">
                            <div className="space-y-1">
                              {pesanan.details.map((detail) => (
                                <p key={detail.id} className="text-[11px] text-gray-600 truncate max-w-[180px]">
                                  <span className="font-bold text-gray-800">{detail.qty}x</span> {detail.namaProduct}
                                </p>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* --- MODAL DETAIL PESANAN --- */}
      {selectedPesanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-5 border-b flex justify-between items-center bg-gray-50 shrink-0">
              <div>
                <h3 className="font-extrabold text-[#1B2A6B] text-base">Detail Pesanan #{selectedPesanan.id}</h3>
                <p className="text-xs text-gray-500">Pelanggan: {selectedPesanan.namaUser}</p>
              </div>
              <button onClick={() => setSelectedPesanan(null)} className="text-gray-400 hover:text-gray-600 font-bold p-2 text-sm">✕</button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <p className="font-extrabold text-[#1B2A6B] text-sm mb-1">Update Status Pengerjaan</p>
                  <p className="text-[10px] text-gray-500">Sesuaikan status dengan proses kerja di percetakan.</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select 
                    value={selectedStatusId}
                    onChange={(e) => setSelectedStatusId(Number(e.target.value))}
                    className="p-2 rounded-lg border border-gray-300 text-xs font-bold text-gray-700 outline-none focus:border-[#2E9DF7] w-full sm:w-auto min-w-[150px]"
                  >
                    <option value="" disabled>Pilih Status...</option>
                    {statusList.map(status => (
                      <option key={status.id} value={status.id}>{status.nama}</option>
                    ))}
                  </select>
                  <button 
                    onClick={handleUpdateStatus}
                    disabled={isUpdatingStatus || selectedStatusId === "" || selectedStatusId === selectedPesanan.idStatusPengerjaan}
                    className="bg-[#2E9DF7] hover:bg-[#1B2A6B] disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap"
                  >
                    {isUpdatingStatus ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>

              <div>
                <p className="font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat Pengiriman</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">{selectedPesanan.alamat}</p>
              </div>

              <div>
                <p className="font-bold text-gray-400 uppercase tracking-wider mb-2">Item Cetak & File Desain</p>
                <div className="space-y-3">
                  {selectedPesanan.details.map((item, idx) => {
                    const fileUrl = item.desainFilePath 
                      ? (item.desainFilePath.startsWith("http") ? item.desainFilePath : `${API_URL}${item.desainFilePath}`) 
                      : null;

                    return (
                      <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3 shadow-sm">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <span className="font-extrabold text-[#1B2A6B] text-sm">{item.qty}x {item.namaProduct}</span>
                          <span className="font-bold text-[#2E9DF7]">Rp {(item.hargaSatuan * item.qty).toLocaleString("id-ID")}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-gray-600">
                          <div><span className="font-bold text-gray-400">Ukuran Custom:</span> {item.ukuranCustom || "-"}</div>
                          <div><span className="font-bold text-gray-400">Teks Desain:</span> {item.desainText || "-"}</div>
                          <div className="col-span-2"><span className="font-bold text-gray-400">Catatan:</span> {item.notes || "Tidak ada catatan"}</div>
                        </div>

                        <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-100 gap-3">
                          <span className="font-bold text-gray-400">File Desain:</span>
                          {fileUrl ? (
                            <div className="flex items-center gap-2">
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-xl font-bold transition-colors shadow-sm">👁️ Lihat File</a>
                              <a href={fileUrl} target="_blank" download rel="noopener noreferrer" className="bg-blue-50 text-[#2E9DF7] hover:bg-[#2E9DF7] hover:text-white px-3 py-1.5 rounded-xl font-bold transition-colors shadow-sm">📥 Download</a>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic bg-gray-50 px-3 py-1 rounded-lg">Tidak ada file yang dilampirkan</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t bg-gray-50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedPesanan(null)}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-300 shadow-sm"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
