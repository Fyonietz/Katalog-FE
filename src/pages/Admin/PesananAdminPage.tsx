// src/pages/Admin/PesananAdminPage.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import { getAllPesanan, type PesananResponse } from "../../services/pesananService";

export default function PesananAdminPage() {
  const [pesananList, setPesananList] = useState<PesananResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk Modal Detail Pesanan
  const [selectedPesanan, setSelectedPesanan] = useState<PesananResponse | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPesanan();
      // Urutkan pesanan dari yang paling baru (ID terbesar)
      const sorted = data.sort((a, b) => b.id - a.id);
      setPesananList(sorted);
    } catch (err: any) {
      setError(err.message || "Gagal memuat pesanan pelanggan.");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold uppercase">Lunas</span>;
      case "pending": return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>;
      case "unpaid": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold uppercase">Unpaid</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold uppercase">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
          <div>
            <h1 className="text-lg font-bold text-[#1B2A6B]">Manajemen Pesanan</h1>
            <p className="text-xs text-gray-500">Klik baris pesanan untuk melihat detail kustomisasi & preview/download desain.</p>
          </div>
          <button 
            onClick={fetchData}
            className="text-xs font-bold text-[#2E9DF7] hover:text-[#1B2A6B]"
          >
            Refresh Data
          </button>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-10 text-center text-gray-500 text-sm font-medium">Memuat data pesanan...</div>
                ) : error ? (
                  <div className="p-10 text-center text-red-500 text-sm font-medium">{error}</div>
                ) : pesananList.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 text-sm font-medium">Belum ada pesanan yang masuk.</div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="p-4 font-bold">Order ID / Tgl</th>
                        <th className="p-4 font-bold">Pelanggan & Alamat</th>
                        <th className="p-4 font-bold">Total Harga</th>
                        <th className="p-4 font-bold">Status Bayar</th>
                        <th className="p-4 font-bold">Status Pengerjaan</th>
                        <th className="p-4 font-bold">Ringkasan Item</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100">
                      {pesananList.map((pesanan) => (
                        <tr 
                          key={pesanan.id} 
                          onClick={() => setSelectedPesanan(pesanan)}
                          className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                        >
                          <td className="p-4">
                            <p className="font-extrabold text-[#1B2A6B]">#{pesanan.id}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(pesanan.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-gray-800">{pesanan.namaUser}</p>
                            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-1 max-w-[220px]">
                              {pesanan.alamat}
                            </p>
                          </td>
                          <td className="p-4 font-bold text-[#2E9DF7]">
                            Rp {pesanan.totalHarga.toLocaleString("id-ID")}
                          </td>
                          <td className="p-4">
                            {getPaymentBadge(pesanan.paymentStatus)}
                          </td>
                          <td className="p-4">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                              {pesanan.statusPengerjaan}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="space-y-0.5">
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
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- MODAL DETAIL PESANAN & PREVIEW/DOWNLOAD DESAIN --- */}
      {selectedPesanan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-extrabold text-[#1B2A6B] text-base">Detail Pesanan #{selectedPesanan.id}</h3>
                <p className="text-xs text-gray-500">Pelanggan: {selectedPesanan.namaUser}</p>
              </div>
              <button 
                onClick={() => setSelectedPesanan(null)} 
                className="text-gray-400 hover:text-gray-600 font-bold p-2 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Konten Detail */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div>
                <p className="font-bold text-gray-400 uppercase tracking-wider mb-1">Alamat Pengiriman</p>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed">{selectedPesanan.alamat}</p>
              </div>

              <div>
                <p className="font-bold text-gray-400 uppercase tracking-wider mb-2">Item Cetak & File Desain</p>
                <div className="space-y-3">
                  {selectedPesanan.details.map((item, idx) => {
                    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";
                    const fileUrl = item.desainFilePath 
                      ? (item.desainFilePath.startsWith("http") ? item.desainFilePath : `${API_URL}${item.desainFilePath}`) 
                      : null;

                    return (
                      <div key={idx} className="p-4 rounded-2xl border border-gray-200 bg-white space-y-3 shadow-sm">
                        <div className="flex justify-between items-center">
                          <span className="font-extrabold text-[#1B2A6B] text-sm">
                            {item.qty}x {item.namaProduct}
                          </span>
                          <span className="font-bold text-[#2E9DF7]">
                            Rp {(item.hargaSatuan * item.qty).toLocaleString("id-ID")}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-gray-600">
                          <div>
                            <span className="font-bold text-gray-400">Ukuran Custom:</span> {item.ukuranCustom || "-"}
                          </div>
                          <div>
                            <span className="font-bold text-gray-400">Teks Desain:</span> {item.desainText || "-"}
                          </div>
                          <div className="col-span-2">
                            <span className="font-bold text-gray-400">Catatan:</span> {item.notes || "Tidak ada catatan"}
                          </div>
                        </div>

                        {/* Opsi Lihat & Download File Desain */}
                        <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                          <span className="font-bold text-gray-400">File Desain Pelanggan:</span>
                          {fileUrl ? (
                            <div className="flex items-center gap-2">
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                Lihat Desain
                              </a>
                              <a
                                href={fileUrl}
                                target="_blank"
                                download
                                rel="noopener noreferrer"
                                className="bg-blue-50 text-[#2E9DF7] hover:bg-[#2E9DF7] hover:text-white px-3 py-1.5 rounded-xl font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                              >
                                Download
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">Tidak ada file yang diunggah</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedPesanan(null)}
                className="px-5 py-2.5 bg-[#1B2A6B] text-white rounded-xl text-xs font-bold hover:bg-[#111A42] shadow-md"
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
