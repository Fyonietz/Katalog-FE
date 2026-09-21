// src/pages/Pelanggan/PesananPage.tsx
import { useEffect, useState } from "react";
import { getPesananUser, type PesananResponse } from "../../services/pesananService";
import { createPaymentSnap, checkPaymentStatus } from "../../services/paymentService";

declare global {
  interface Window {
    snap: any;
  }
}

export default function PesananPage() {
  const [pesananList, setPesananList] = useState<PesananResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchPesanan = async () => {
    try {
      setLoading(true);
      const data = await getPesananUser();
      setPesananList(data || []);
    } catch (err) {
      console.error("Gagal memuat pesanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  // Fungsi Polling status pembayaran (Frontend Snap Docs)
  const pollPaymentStatus = async (idPesanan: number) => {
    let attempts = 0;
    const maxAttempts = 15; // Coba 15 kali (30 detik)

    const interval = setInterval(async () => {
      attempts++;
      try {
        const paymentInfo = await checkPaymentStatus(idPesanan);
        if (paymentInfo.paymentStatus === "paid") {
          clearInterval(interval);
          alert("Pembayaran berhasil dikonfirmasi!");
          fetchPesanan(); // Refresh data agar badge berubah jadi Paid
        } else if (["failed", "expired", "cancelled"].includes(paymentInfo.paymentStatus)) {
          clearInterval(interval);
          alert(`Pembayaran ${paymentInfo.paymentStatus}.`);
          fetchPesanan();
        }
      } catch (err) {
        console.error("Gagal polling status", err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        fetchPesanan(); // Refresh terakhir setelah polling selesai
      }
    }, 2000);
  };

  // Fungsi Melanjutkan Pembayaran yang tertunda
  const handleLanjutkanPembayaran = async (idPesanan: number) => {
    setProcessingId(idPesanan);
    try {
      // 1. Minta Snap Token ke Backend
      const paymentData = await createPaymentSnap(idPesanan);

      // 2. Buka Snap Midtrans
      window.snap.pay(paymentData.snapToken, {
        onSuccess: () => pollPaymentStatus(idPesanan),
        onPending: () => pollPaymentStatus(idPesanan),
        onError: () => {
          alert("Pembayaran gagal diproses oleh Midtrans.");
          setProcessingId(null);
        },
        onClose: () => {
          setProcessingId(null);
          fetchPesanan();
        }
      });
    } catch (err: any) {
      alert("Gagal memuat token pembayaran: " + (err.response?.data?.message || err.message));
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase">Lunas</span>;
      case "pending": return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase">Menunggu Pembayaran</span>;
      case "unpaid": return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase">Belum Bayar</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] font-extrabold uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Pesanan Saya</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">
          Pantau status pengerjaan dan pembayaran produk cetak Anda.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
        </div>
      ) : pesananList.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <p className="text-sm font-bold text-gray-600">Belum Ada Pesanan</p>
          <a href="/shopping" className="mt-4 inline-block bg-[#1B2A6B] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md">
            Pesan Sekarang
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {pesananList.map((pesanan) => (
            <div key={pesanan.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-500">Order #{pesanan.id}</span>
                  <span>•</span>
                  <span className="text-[10px] text-gray-400">
                    {new Date(pesanan.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                
                <div className="mb-3">
                  {getStatusBadge(pesanan.paymentStatus)}
                  <span className="ml-2 bg-blue-50 text-blue-600 px-2 py-1 rounded text-[10px] font-bold uppercase border border-blue-100">
                    {pesanan.statusPengerjaan}
                  </span>
                </div>

                <div className="space-y-1">
                  {pesanan.details.map((item) => (
                    <p key={item.id} className="text-xs font-bold text-[#1B2A6B]">
                      {item.qty}x {item.namaProduct} 
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 border-t md:border-t-0 md:border-l border-gray-100 pt-3 md:pt-0 md:pl-5">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 text-left md:text-right">Total Bayar</p>
                  <p className="text-base font-extrabold text-[#2E9DF7]">
                    Rp {pesanan.totalHarga.toLocaleString("id-ID")}
                  </p>
                </div>
                
                {/* Tombol Lanjutkan Pembayaran jika status unpaid/pending */}
                {["unpaid", "pending"].includes(pesanan.paymentStatus.toLowerCase()) && (
                  <button
                    onClick={() => handleLanjutkanPembayaran(pesanan.id)}
                    disabled={processingId === pesanan.id}
                    className="w-full md:w-auto px-4 py-2 bg-[#1B2A6B] hover:bg-[#111A42] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {processingId === pesanan.id ? "Memproses..." : "Bayar Sekarang"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
