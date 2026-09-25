// src/pages/Pelanggan/PesananPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPesananUser, deletePesanan, type PesananResponse } from "../../services/pesananService";
import { createPaymentSnap, checkPaymentStatus } from "../../services/paymentService";
import { showModal, showConfirm } from "../../lib/showModal";
import type { DimensionUnit } from "../../models/Produk";
import { detailRateLabel, detailSubtotal, formatDetailDimensions, fromMeters } from "../../utils/pricing";

declare global {
  interface Window {
    snap: any;
  }
}

export default function PesananPage() {
  const [pesananList, setPesananList] = useState<PesananResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const fetchPesanan = async () => {
    try {
      setLoading(true);
      const data = await getPesananUser();
      
      // Filter: Jangan tampilkan pesanan yang sudah LUNAS dan SELESAI dikerjakan
      // (Pesanan ini nantinya hanya akan ditarik di halaman RiwayatPage)
      const activeOrders = (data || []).filter(
        (p) => !(p.paymentStatus.toLowerCase() === "paid" && p.statusPengerjaan?.toLowerCase() === "selesai")
      );

      setPesananList(activeOrders.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const pollPaymentStatus = async (idPesanan: number) => {
    let attempts = 0;
    const maxAttempts = 15; 
    
    const interval = setInterval(async () => {
      attempts++;
      try {
        const paymentInfo = await checkPaymentStatus(idPesanan);
        if (paymentInfo.paymentStatus === "paid") {
          clearInterval(interval);
          showModal("Pembayaran berhasil dikonfirmasi!", { variant: "success" });
          fetchPesanan();
        } else if (["failed", "expired", "cancelled"].includes(paymentInfo.paymentStatus)) {
          clearInterval(interval);
          showModal(`Status Pembayaran: ${paymentInfo.paymentStatus}.`, { variant: "warning" });
          fetchPesanan();
        }
      } catch (err) {
        console.error("Gagal polling status", err);
      }
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        fetchPesanan();
      }
    }, 2000);
  };

  const handleLanjutkanPembayaran = async (idPesanan: number) => {
    setProcessingId(idPesanan);
    try {
      const paymentData = await createPaymentSnap(idPesanan);
      
      if (window.snap) {
        window.snap.pay(paymentData.snapToken, {
          onSuccess: () => pollPaymentStatus(idPesanan),
          onPending: () => pollPaymentStatus(idPesanan),
          onError: () => {
            showModal("Pembayaran gagal diproses.", { variant: "error" });
            setProcessingId(null);
            fetchPesanan();
          },
          onClose: () => {
            setProcessingId(null);
            fetchPesanan();
          }
        });
      } else if (paymentData.redirectUrl) {
        window.location.href = paymentData.redirectUrl;
      }
    } catch (err: any) {
      showModal(err.message || "Gagal memuat pembayaran.", { variant: "error" });
      setProcessingId(null);
    }
  };

  const handleBatalkanPesanan = async (idPesanan: number) => {
    const ok = await showConfirm(
      "Apakah Anda yakin ingin membatalkan dan menghapus pesanan ini?",
      { title: "Batalkan Pesanan", danger: true, confirmLabel: "Ya, Batalkan" }
    );
    if (!ok) return;
    
    setDeletingId(idPesanan);
    try {
      await deletePesanan(idPesanan);
      showModal("Pesanan berhasil dibatalkan.", { variant: "success" });
      fetchPesanan();
    } catch (err: any) {
      showModal(err.message || "Gagal membatalkan pesanan. Mungkin pesanan sudah terkunci di sistem pembayaran.", { variant: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadFileDesain = async (pesanan: PesananResponse, file: File | null) => {
    if (!file) return;
    setUploadingId(pesanan.id);

    try {
      const form = new FormData();
      form.append("idAlamat", String(pesanan.idAlamat));

      pesanan.details.forEach((item, index) => {
        form.append(`items[${index}].idProduct`, String(item.idProduct));
        form.append(`items[${index}].qty`, String(item.qty));
        
        if (item.idUkuranProduk) form.append(`items[${index}].idUkuranProduk`, String(item.idUkuranProduk));
        if (item.ukuranCustom) form.append(`items[${index}].ukuranCustom`, item.ukuranCustom);
        if (item.notes) form.append(`items[${index}].notes`, item.notes);
        if (item.desainText) form.append(`items[${index}].desainText`, item.desainText);

        // Response server menyimpan dimensi ternormalisasi (meter); kembalikan
        // ke satuan product sebelum dikirim ulang agar harga tetap sama.
        const unit: DimensionUnit = item.dimensionUnit === "centimeter" ? "centimeter" : "meter";
        const toProductUnit = (meters?: number | null) =>
          meters === null || meters === undefined ? undefined : Number(fromMeters(Number(meters), unit).toFixed(2));
        if (item.pricingMode === "PerArea") {
          const width = toProductUnit(item.widthMeters);
          const height = toProductUnit(item.heightMeters);
          if (width) form.append(`items[${index}].width`, String(width));
          if (height) form.append(`items[${index}].height`, String(height));
        }
        if (item.pricingMode === "PerLength") {
          const length = toProductUnit(item.lengthMeters);
          if (length) form.append(`items[${index}].length`, String(length));
        }

        form.append(`items[${index}].desain`, file);
      });

      const token = localStorage.getItem("token") || "";
      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";

      const res = await fetch(`${API_URL}/api/v1/pesanan/${pesanan.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memperbarui file desain.");
      }

      showModal("File desain berhasil diunggah/diperbarui!", { variant: "success" });
      fetchPesanan();
    } catch (err: any) {
      showModal(err.message || "Terjadi kesalahan saat mengunggah file.", { variant: "error" });
    } finally {
      setUploadingId(null);
    }
  };

  // Badge Status Pembayaran
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-emerald-200">Lunas</span>;
      case "pending": return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-amber-200">Menunggu Pembayaran</span>;
      case "unpaid": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-red-200">Belum Bayar</span>;
      case "cancelled":
      case "expired": 
      case "failed": return <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-gray-200">Dibatalkan</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-wide border border-gray-200">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Pesanan Saya</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Selesaikan pembayaran atau unggah file desain cetakan Anda.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      ) : pesananList.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center py-16">
          <p className="text-sm font-bold text-[#1B2A6B]">Belum Ada Pesanan Aktif</p>
          <p className="text-xs text-gray-500 mt-1">Pesanan yang sudah selesai atau riwayat transaksi dapat dilihat di menu Riwayat.</p>
          <Link to="/shopping" className="mt-4 inline-block bg-[#1B2A6B] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md">
            Mulai Belanja
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {pesananList.map((pesanan) => {
            const isUnpaid = pesanan.paymentStatus.toLowerCase() === "unpaid";
            const canPay = ["unpaid", "pending"].includes(pesanan.paymentStatus.toLowerCase());
            
            // --- LOGIKA BACKGROUND KARTU (FULL CARD) ---
            let cardBgClass = "bg-white border-gray-100 shadow-sm"; // Default
            const workStat = (pesanan.statusPengerjaan || "").toLowerCase();
            
            if (isUnpaid) {
              cardBgClass = "bg-red-50/40 border-red-100 shadow-sm"; 
            } else if (pesanan.paymentStatus.toLowerCase() === "paid") {
              if (workStat === "selesai") {
                cardBgClass = "bg-emerald-50 border-emerald-200 shadow-md"; 
              } else if (workStat === "diproses" || workStat === "proses") {
                cardBgClass = "bg-blue-50 border-blue-200 shadow-md"; 
              } else if (workStat === "menunggu" || workStat === "konfirmasi" || workStat === "menunggu konfirmasi") {
                cardBgClass = "bg-amber-50 border-amber-200 shadow-sm"; 
              }
            }
            
            return (
              <div 
                key={pesanan.id} 
                // Background kartu disuntikkan di sini
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
                    
                    {/* Badge Pengerjaan dikembalikan ke gaya elegan abu-abu gelap */}
                    {!["cancelled", "expired", "failed"].includes(pesanan.paymentStatus.toLowerCase()) && (
                       <span className="bg-[#64707D] text-white px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide shadow-sm">
                         Pengerjaan: {pesanan.statusPengerjaan}
                       </span>
                    )}
                  </div>
                  
                  <div className="space-y-3 pt-1">
                    {pesanan.details.map((item) => {
                      const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5283";
                      const fileUrl = item.desainFilePath 
                        ? (item.desainFilePath.startsWith("http") ? item.desainFilePath : `${API_URL}${item.desainFilePath}`) 
                        : null;

                      return (
                        <div key={item.id} className="bg-white/70 p-3.5 rounded-xl border border-white/80 shadow-sm space-y-2 backdrop-blur-sm">
                          <div className="flex justify-between items-center gap-3">
                            <p className="text-xs font-extrabold text-[#1B2A6B]">
                              {item.qty}x {item.namaProduct}
                            </p>
                            <p className="text-[10px] font-bold text-[#2E9DF7] whitespace-nowrap">
                              Rp {detailSubtotal(item).toLocaleString("id-ID")}
                            </p>
                          </div>

                          <p className="text-[10px] text-gray-400 font-semibold">
                            {detailRateLabel(item)}{item.namaUkuran ? ` • ${item.namaUkuran}` : ""}
                          </p>

                          {(formatDetailDimensions(item) || item.ukuranCustom || item.notes || item.desainText) && (
                            <div className="space-y-0.5 text-[10px] text-gray-500 font-medium">
                              {formatDetailDimensions(item) && <p>• Dimensi: {formatDetailDimensions(item)}</p>}
                              {item.ukuranCustom && <p>• Ukuran: {item.ukuranCustom}</p>}
                              {item.notes && <p>• Catatan: {item.notes}</p>}
                              {item.desainText && <p>• Teks: {item.desainText}</p>}
                            </div>
                          )}

                          {/* Status & Tombol Upload File Desain Khusus Pesanan Ini */}
                          <div className="pt-2 border-t border-gray-200/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="text-[10px]">
                              <span className="font-bold text-gray-500">File Desain(Opsional): </span>
                              {fileUrl ? (
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">
                                  Lihat File Terunggah
                                </a>
                              ) : (
                                <span className="text-amber-600 font-semibold">Belum ada file</span>
                              )}
                            </div>

                            {/* Opsi Upload hanya muncul jika status masih Unpaid */}
                            {isUnpaid ? (
                              <div className="w-full sm:w-auto">
                                <label className={`inline-block px-3 py-1.5 bg-[#2E9DF7] hover:bg-[#1B2A6B] text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow-sm ${uploadingId === pesanan.id ? "opacity-50 cursor-not-allowed" : ""}`}>
                                  {uploadingId === pesanan.id ? "Mengunggah..." : (fileUrl ? "Ganti File Desain" : "Upload File Desain")}
                                  <input
                                    type="file"
                                    disabled={uploadingId === pesanan.id}
                                    onChange={(e) => handleUploadFileDesain(pesanan, e.target.files ? e.target.files[0] : null)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            ) : (
                              <span className="text-[9px] text-gray-400 italic">File terkunci</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Kanan (Harga & Aksi Bayar/Batal) */}
                <div className="flex flex-col items-start md:items-end gap-4 border-t md:border-t-0 md:border-l border-gray-200/60 pt-4 md:pt-0 md:pl-6 w-full md:w-auto shrink-0">
                  <div className="w-full md:text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Bayar</p>
                    <p className="text-xl font-black text-[#2E9DF7]">Rp {pesanan.totalHarga.toLocaleString("id-ID")}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2.5 w-full">
                    {canPay && (
                      <button
                        onClick={() => handleLanjutkanPembayaran(pesanan.id)}
                        disabled={processingId === pesanan.id}
                        className="w-full px-6 py-2.5 bg-[#1B2A6B] hover:bg-[#111A42] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center"
                      >
                        {processingId === pesanan.id ? "Memproses..." : "Bayar Sekarang"}
                      </button>
                    )}

                    {isUnpaid ? (
                       <button
                         onClick={() => handleBatalkanPesanan(pesanan.id)}
                         disabled={deletingId === pesanan.id}
                         className="w-full px-4 py-2 border-2 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300 rounded-xl text-xs font-bold transition-all text-center bg-white/50"
                       >
                         {deletingId === pesanan.id ? "Membatalkan..." : "Batalkan Pesanan"}
                       </button>
                    ) : null}
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
