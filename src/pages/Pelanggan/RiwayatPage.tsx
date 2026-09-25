// src/pages/Pelanggan/RiwayatPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPesananUser, type PesananResponse } from "../../services/pesananService";
import { detailSubtotal, formatDetailDimensions } from "../../utils/pricing";

export default function RiwayatPage() {
  const [historyList, setHistoryList] = useState<PesananResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getPesananUser();
      
      // Filter: HANYA tampilkan pesanan yang sudah (LUNAS & SELESAI) ATAU (DIBATALKAN/EXPIRED)
      const historyOrders = (data || []).filter((p) => {
        const isCompleted = p.paymentStatus.toLowerCase() === "paid" && p.statusPengerjaan?.toLowerCase() === "selesai";
        const isCancelled = ["cancelled", "expired", "failed"].includes(p.paymentStatus.toLowerCase()) || p.statusPengerjaan?.toLowerCase() === "dibatalkan";
        return isCompleted || isCancelled;
      });

      setHistoryList(historyOrders.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Gagal memuat riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Badge Status Pembayaran
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200">Lunas</span>;
      case "cancelled":
      case "expired": 
      case "failed": return <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-red-200">Dibatalkan</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-gray-200">{status}</span>;
    }
  };

  // Badge Status Pengerjaan (Khusus Riwayat)
  const getStatusPengerjaanBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "selesai") {
      return <span className="bg-emerald-500 text-white px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest shadow-sm">Selesai Dikerjakan</span>;
    }
    if (s === "dibatalkan") {
      return <span className="bg-gray-500 text-white px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest shadow-sm">Dibatalkan</span>;
    }
    return <span className="bg-[#64707D] text-white px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide shadow-sm">{status}</span>;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Riwayat Pesanan</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Daftar seluruh transaksi pemesanan yang telah selesai atau dibatalkan.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-gray-50 rounded-2xl animate-pulse border border-gray-100"></div>
          <div className="h-32 bg-gray-50 rounded-2xl animate-pulse border border-gray-100"></div>
        </div>
      ) : historyList.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center py-12">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-sm font-bold text-gray-600">Belum Ada Riwayat Transaksi</p>
          <p className="text-xs text-gray-400 mt-1 mb-5">
            Semua transaksi cetak yang sudah selesai dikerjakan akan tersimpan di sini.
          </p>
          <Link to="/shopping" className="inline-block bg-[#1B2A6B] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md hover:bg-[#111A42] transition-colors">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {historyList.map((pesanan) => {
            const isCancelled = ["cancelled", "expired", "failed"].includes(pesanan.paymentStatus.toLowerCase()) || pesanan.statusPengerjaan?.toLowerCase() === "dibatalkan";
            
            // Kartu riwayat dibedakan backgroundnya: putih (selesai) atau abu-abu/merah tipis (batal)
            const cardBgClass = isCancelled ? "bg-gray-50/50 border-gray-200" : "bg-white border-gray-100 shadow-sm hover:shadow-md";

            return (
              <div 
                key={pesanan.id} 
                className={`rounded-2xl p-5 md:p-6 border transition-all flex flex-col md:flex-row md:items-start justify-between gap-5 ${cardBgClass}`}
              >
                
                {/* Info Kiri */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-gray-400">ORDER #{pesanan.id}</span>
                    <span className="text-xs font-semibold text-gray-400">
                      {new Date(pesanan.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(pesanan.paymentStatus)}
                    {getStatusPengerjaanBadge(pesanan.statusPengerjaan)}
                  </div>
                  
                  <div className="space-y-2 pt-1 opacity-90">
                    {pesanan.details.map((item) => {
                      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";
                      const fileUrl = item.desainFilePath 
                        ? (item.desainFilePath.startsWith("http") ? item.desainFilePath : `${API_URL}${item.desainFilePath}`) 
                        : null;

                      return (
                        <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm space-y-1.5">
                          <div className="flex justify-between items-center">
                            <p className="text-xs font-extrabold text-gray-700">
                              {item.qty}x {item.namaProduct}
                            </p>
                            <p className="text-[10px] font-bold text-[#2E9DF7]">
                              Rp {detailSubtotal(item).toLocaleString("id-ID")}
                            </p>
                          </div>

                          {(formatDetailDimensions(item) || item.ukuranCustom || item.notes || item.desainText) && (
                            <div className="space-y-0.5 text-[10px] text-gray-500 font-medium pb-1 border-b border-gray-50">
                              {formatDetailDimensions(item) && <p>• Dimensi: {formatDetailDimensions(item)}</p>}
                              {item.namaUkuran && <p>• Varian: {item.namaUkuran}</p>}
                              {item.ukuranCustom && <p>• Ukuran: {item.ukuranCustom}</p>}
                              {item.notes && <p>• Catatan: {item.notes}</p>}
                              {item.desainText && <p>• Teks: {item.desainText}</p>}
                            </div>
                          )}

                          {fileUrl && (
                            <div className="pt-1">
                              <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 font-bold hover:underline">
                                👁️ Lihat File Desain
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Kanan (Total Harga & Alamat) */}
                <div className="flex flex-col items-start md:items-end gap-3 border-t md:border-t-0 md:border-l border-gray-200/60 pt-4 md:pt-0 md:pl-6 w-full md:w-56 shrink-0">
                  <div className="w-full md:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Akhir</p>
                    <p className={`text-xl font-black ${isCancelled ? 'text-gray-400 line-through' : 'text-[#1B2A6B]'}`}>
                      Rp {pesanan.totalHarga.toLocaleString("id-ID")}
                    </p>
                  </div>
                  
                  {/* Menampilkan ringkasan alamat pengiriman */}
                  <div className="w-full bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Dikirim ke:</p>
                    <p className="text-[10px] text-gray-600 font-medium leading-relaxed line-clamp-3">
                      {pesanan.alamat}
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
