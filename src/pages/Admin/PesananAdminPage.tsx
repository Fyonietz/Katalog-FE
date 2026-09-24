// src/pages/Admin/PesananAdminPage.tsx
import { useEffect, useState } from "react";
import { getAllPesanan, updateStatusPengerjaan, type PesananResponse } from "../../services/pesananService";
import { X, MapPin, Package, DownloadCloud, Eye } from "lucide-react"; 

interface StatusPengerjaan {
  id: number;
  nama: string;
}

export default function PesananAdminPage() {
  const [pesananList, setPesananList] = useState<PesananResponse[]>([]);
  const [statusList, setStatusList] = useState<StatusPengerjaan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("Semua");
  const [activeTab, setActiveTab] = useState<string>("Semua");

  const [selectedPesanan, setSelectedPesanan] = useState<PesananResponse | null>(null);
  const [selectedStatusId, setSelectedStatusId] = useState<number | "">("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";
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
      setPesananList(data.sort((a, b) => b.id - a.id));
    } catch (err: any) {
      setError(err.message || "Gagal memuat pesanan pelanggan.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/status-pengerjaan`);
      if (res.ok) setStatusList(await res.json());
    } catch (err) {
      console.error("Gagal memuat master status", err);
    }
  };

  useEffect(() => {
    if (selectedPesanan) setSelectedStatusId(selectedPesanan.idStatusPengerjaan || "");
  }, [selectedPesanan]);

  const handleUpdateStatus = async () => {
    if (!selectedPesanan || selectedStatusId === "") return;
    setIsUpdatingStatus(true);
    try {
      await updateStatusPengerjaan(selectedPesanan.id, Number(selectedStatusId));
      alert("Status berhasil diubah!");
      setSelectedPesanan(null);
      fetchData();
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Fungsi khusus untuk memaksa browser mengunduh file, bukan membukanya
  const handleForceDownload = async (fileUrl: string, defaultFileName: string) => {
    try {
      // Fetch data file menjadi Blob agar browser dipaksa menyimpannya
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response error");
      const blob = await response.blob();
      
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = defaultFileName; // Beri nama file unduhan
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Gagal mendownload secara programatik, fallback ke buka tab baru", err);
      // Fallback: Jika terblokir CORS, minimal file tetap terbuka di tab baru
      window.open(fileUrl, "_blank");
    }
  };

  const baseFiltered = pesananList.filter(pesanan => {
    const matchPayment = paymentFilter === "Semua" || pesanan.paymentStatus?.toLowerCase() === paymentFilter.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = pesanan.id.toString().includes(searchLower) || pesanan.namaUser.toLowerCase().includes(searchLower) || pesanan.alamat.toLowerCase().includes(searchLower);
    return matchPayment && matchSearch;
  });

  const finalPesanan = baseFiltered.filter(pesanan => activeTab === "Semua" || pesanan.statusPengerjaan?.toLowerCase() === activeTab.toLowerCase());

  const getPaymentBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-emerald-200">Lunas</span>;
      case "pending": return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-amber-200">Pending</span>;
      case "unpaid": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-red-200">Unpaid</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-bold uppercase border border-gray-200">{status}</span>;
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
    <div className="flex-1 flex flex-col min-w-0 h-full bg-[#F4F6FB]">
      
      {/* Topbar Internal */}
      <div className="shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 z-10">
        <div>
          <h1 className="text-lg font-bold text-[#1B2A6B]">Manajemen Pesanan</h1>
          <p className="text-xs text-gray-500">Kelola dan pantau antrean pesanan.</p>
        </div>
        <button onClick={fetchData} className="text-xs font-bold bg-blue-50 text-[#2E9DF7] hover:bg-[#2E9DF7] hover:text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto">
          ↻ Refresh Data
        </button>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-4">
          
          {/* Tools & Filter */}
          <div className="shrink-0 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Cari ID, Nama, Alamat..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 text-sm rounded-xl border outline-none focus:border-[#2E9DF7] shadow-sm"
                />
              </div>
              <div className="w-full sm:w-48 shrink-0">
                <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="w-full px-4 py-2 text-sm font-bold border rounded-xl outline-none shadow-sm cursor-pointer">
                  <option value="Semua">Semua Pembayaran</option>
                  <option value="paid">Lunas</option>
                  <option value="unpaid">Belum Bayar</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {TABS.map((tab) => {
                const count = tab === "Semua" ? baseFiltered.length : baseFiltered.filter(p => p.statusPengerjaan?.toLowerCase() === tab.toLowerCase()).length;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border shadow-sm transition-colors ${activeTab === tab ? "bg-[#1B2A6B] text-white border-[#1B2A6B]" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                    {tab} <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab ? "bg-white/20" : "bg-gray-100"}`}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Tabel Pesanan */}
          <div className="flex-1 bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden">
            {loading ? <div className="flex-1 flex items-center justify-center text-sm font-bold text-gray-400">Memuat Data...</div> : 
             finalPesanan.length === 0 ? <div className="flex-1 flex flex-col items-center justify-center p-10"><p className="font-bold text-gray-500">Tidak ada pesanan ditemukan</p></div> : (
              <div className="flex-1 overflow-y-auto relative">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 border-b">Order ID</th>
                      <th className="p-4 border-b">Pelanggan</th>
                      <th className="p-4 border-b">Total</th>
                      <th className="p-4 border-b">Status Bayar</th>
                      <th className="p-4 border-b">Pengerjaan</th>
                      <th className="p-4 border-b">Item</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y">
                    {finalPesanan.map((pesanan) => (
                      <tr key={pesanan.id} onClick={() => setSelectedPesanan(pesanan)} className="hover:bg-blue-50/50 cursor-pointer transition-colors">
                        <td className="p-4"><p className="font-black text-[#1B2A6B]">#{pesanan.id}</p></td>
                        <td className="p-4"><p className="font-bold text-gray-700">{pesanan.namaUser}</p></td>
                        <td className="p-4 font-black text-[#2E9DF7]">Rp {pesanan.totalHarga.toLocaleString("id-ID")}</td>
                        <td className="p-4">{getPaymentBadge(pesanan.paymentStatus)}</td>
                        <td className="p-4"><span className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-md uppercase border shadow-sm ${getPengerjaanBadge(pesanan.statusPengerjaan)}`}>{pesanan.statusPengerjaan}</span></td>
                        <td className="p-4 text-xs font-semibold text-gray-500">{pesanan.details.length} Jenis</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL DETAIL (UX Ditingkatkan) --- */}
      {selectedPesanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100">
            
            {/* Modal Header */}
            <div className="p-5 md:px-8 md:py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h3 className="font-black text-2xl text-[#1B2A6B] tracking-tight">Order #{selectedPesanan.id}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Atas nama <span className="font-bold text-gray-700">{selectedPesanan.namaUser}</span>
                </p>
              </div>
              <button onClick={() => setSelectedPesanan(null)} className="p-2.5 bg-white text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors shadow-sm border border-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 md:p-8 overflow-y-auto space-y-7 flex-1 custom-scrollbar">
              
              {/* Section 1: Update Status Box */}
              <div className="bg-blue-50/60 border border-blue-100 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div>
                  <p className="font-extrabold text-[#1B2A6B] text-sm">Update Pengerjaan</p>
                  <p className="text-[10px] text-blue-600 mt-0.5">Ubah status pesanan ini sesuai progres aktual.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <select 
                    value={selectedStatusId} 
                    onChange={(e) => setSelectedStatusId(Number(e.target.value))} 
                    className="flex-1 sm:w-44 p-2.5 bg-white border border-blue-200 focus:border-[#2E9DF7] rounded-xl text-xs font-bold text-gray-700 outline-none shadow-sm cursor-pointer transition-colors"
                  >
                    <option value="" disabled>Pilih Status...</option>
                    {statusList.map(st => <option key={st.id} value={st.id}>{st.nama}</option>)}
                  </select>
                  <button 
                    onClick={handleUpdateStatus} 
                    disabled={isUpdatingStatus || selectedStatusId === "" || selectedStatusId === selectedPesanan.idStatusPengerjaan} 
                    className="bg-[#2E9DF7] hover:bg-[#1B2A6B] text-white px-6 py-2.5 rounded-xl text-xs font-extrabold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isUpdatingStatus ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </div>

              {/* Section 2: Alamat Pengiriman */}
              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                   <MapPin className="w-3.5 h-3.5" /> Alamat Pengiriman
                </h4>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">{selectedPesanan.alamat}</p>
                </div>
              </div>

              {/* Section 3: Rincian Item & Download File */}
              <div>
                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                   <Package className="w-3.5 h-3.5" /> Rincian Item ({selectedPesanan.details.length})
                </h4>
                
                <div className="space-y-4">
                  {selectedPesanan.details.map((item, i) => {
                    const fileUrl = item.desainFilePath ? (item.desainFilePath.startsWith("http") ? item.desainFilePath : `${API_URL}${item.desainFilePath}`) : null;
                    
                    // Ambil nama file asli dari URL (jika ada), jika tidak gunakan nama default
                    const fileName = fileUrl ? fileUrl.split('/').pop() : `Desain_Order_${selectedPesanan.id}_Item_${i+1}`;

                    return (
                      <div key={i} className="p-5 border border-gray-200 rounded-2xl bg-white shadow-sm hover:border-blue-300 transition-colors space-y-4">
                        
                        {/* Judul Item */}
                        <div className="flex items-center gap-3">
                          <span className="bg-[#1B2A6B] text-white px-2.5 py-1 rounded-lg text-[10px] font-black">
                            {item.qty}x
                          </span>
                          <span className="font-extrabold text-[#1B2A6B] text-sm">{item.namaProduct}</span>
                        </div>
                        
                        {/* Box Catatan/Spesifikasi */}
                        {(item.ukuranCustom || item.notes || item.desainText) && (
                          <div className="bg-gray-50 rounded-xl p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 border border-gray-100 text-xs">
                            {item.ukuranCustom && (
                              <div>
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Ukuran</span>
                                <span className="font-medium text-gray-700">{item.ukuranCustom}</span>
                              </div>
                            )}
                            {item.notes && (
                              <div>
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Catatan</span>
                                <span className="font-medium text-gray-700">{item.notes}</span>
                              </div>
                            )}
                            {item.desainText && (
                              <div className="sm:col-span-2">
                                <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">Teks Desain</span>
                                <span className="font-medium text-gray-700">{item.desainText}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Area Download / Lihat File */}
                        <div className="pt-4 border-t border-dashed border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <span className="text-xs font-bold text-gray-500">File Desain Cetak:</span>
                          {fileUrl ? (
                            <div className="flex items-center gap-2">
                              {/* Tombol Lihat (Membuka di tab baru) */}
                              <a 
                                href={fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-1.5 bg-white text-gray-600 hover:text-[#2E9DF7] hover:bg-blue-50 px-3 py-2 rounded-xl text-xs font-bold transition-all border border-gray-200 hover:border-[#2E9DF7] shadow-sm"
                                title="Lihat file di tab baru"
                              >
                                <Eye className="w-4 h-4" /> 
                                Lihat
                              </a>
                              
                              {/* Tombol Download (Memaksa unduh ke perangkat) */}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleForceDownload(fileUrl, fileName || `Desain_${selectedPesanan.id}.png`);
                                }}
                                className="flex items-center gap-1.5 bg-blue-50 text-[#2E9DF7] hover:bg-[#2E9DF7] hover:text-white px-4 py-2 rounded-xl text-xs font-extrabold transition-all border border-blue-100 hover:border-[#2E9DF7] shadow-sm"
                              >
                                <DownloadCloud className="w-4 h-4" /> 
                                Download
                              </button>
                            </div>
                          ) : (
                            <span className="bg-gray-100 text-gray-400 px-4 py-2 rounded-xl text-[10px] font-bold border border-gray-200">
                              Tidak ada file terlampir
                            </span>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
