// src/pages/Pelanggan/CheckoutPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, getCartTotal, clearCart } from "../../services/cartService";
import { getAlamatUser, type AlamatGetResponse } from "../../services/alamatService";
import { showModal } from "../../lib/showModal";
import type { CartItem } from "../../models/CartItem";

// 1. Deklarasi global untuk TypeScript agar mengenali objek window.snap dari Midtrans
declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  const [alamatList, setAlamatList] = useState<AlamatGetResponse[]>([]);
  const [selectedAlamatId, setSelectedAlamatId] = useState<number | null>(null);
  const [loadingAlamat, setLoadingAlamat] = useState<boolean>(true);
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Load keranjang dan alamat saat halaman dimuat
  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      // Jika keranjang kosong, kembalikan ke halaman keranjang
      navigate("/dashboard/pelanggan/keranjang");
      return;
    }
    setCartItems(items);

    const fetchAlamat = async () => {
      try {
        const data = await getAlamatUser();
        setAlamatList(data || []);
        // Otomatis pilih alamat pertama sebagai default jika ada
        if (data && data.length > 0) {
          setSelectedAlamatId(data[0].id);
        }
      } catch (err) {
        console.error("Gagal mengambil alamat:", err);
      } finally {
        setLoadingAlamat(false);
      }
    };

    fetchAlamat();
  }, [navigate]);

  // Kalkulasi Harga
  const subTotal = getCartTotal(cartItems);
  const biayaLayanan = 2500; // Contoh biaya layanan/payment gateway
  const grandTotal = subTotal + biayaLayanan;

  // Handler Tombol Bayar
  const handlePayment = async () => {
    if (!selectedAlamatId) {
      showModal("Harap pilih alamat pengiriman terlebih dahulu.");
      return;
    }

    setIsProcessing(true);

    try {
      /* 
        =========================================
        INTEGRASI MIDTRANS (Saat backend siap)
        =========================================
        
        // 1. Hit API Backend C# Anda untuk membuat transaksi dan mendapatkan Snap Token
        const payload = {
          alamatId: selectedAlamatId,
          items: cartItems.map(c => ({ produkId: c.produk.id, qty: c.qty })),
          totalBayar: grandTotal 
        };

        const response = await fetch('/api/v1/transaction', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        const snapToken = data.token; // Sesuaikan dengan response JSON backend Anda

        // 2. Panggil Popup Snap Midtrans
        window.snap.pay(snapToken, {
          onSuccess: function (result: any) {
            console.log("Pembayaran Sukses:", result);
            clearCart(); 
            navigate('/dashboard/pelanggan/pesanan'); 
          },
          onPending: function (result: any) {
            console.log("Pembayaran Pending:", result);
            clearCart(); 
            navigate('/dashboard/pelanggan/pesanan');
          },
          onError: function (result: any) {
            console.error("Pembayaran Error:", result);
            showModal("Pembayaran gagal diproses oleh sistem.");
            setIsProcessing(false);
          },
          onClose: function () {
            showModal("Anda menutup halaman pembayaran sebelum menyelesaikannya.");
            setIsProcessing(false);
          }
        });
      */

      // --- SIMULASI SEMENTARA (Hapus ini jika backend sudah terhubung) ---
      console.log("Memproses pembayaran untuk alamat ID:", selectedAlamatId);
      setTimeout(() => {
        showModal("Simulasi: Request Midtrans berhasil. (Backend belum terhubung)");
        setIsProcessing(false);
      }, 1500);
      // ------------------------------------------------------------------

    } catch (error) {
      console.error("Error saat memproses pembayaran:", error);
      showModal("Terjadi kesalahan. Silakan coba lagi.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <Link to="/dashboard/pelanggan/keranjang" className="text-xs font-bold text-[#2E9DF7] hover:underline mb-2 inline-block">
          &larr; Kembali ke Keranjang
        </Link>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Checkout Pesanan</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Selesaikan pembayaran untuk memproses pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri: Alamat & Review Item */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section Alamat Pengiriman */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-extrabold text-[#1B2A6B] mb-4">Pilih Alamat Pengiriman</h2>
            
            {loadingAlamat ? (
              <div className="h-20 bg-gray-100 animate-pulse rounded-xl"></div>
            ) : alamatList.length === 0 ? (
              <div className="text-center py-6 border border-dashed rounded-xl bg-gray-50/50">
                <p className="text-xs text-gray-500 mb-3">Anda belum memiliki alamat tersimpan.</p>
                <Link to="/dashboard/pelanggan/settings" className="bg-[#1B2A6B] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md inline-block">
                  Tambah Alamat Sekarang
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {alamatList.map((alamat) => (
                  <label 
                    key={alamat.id} 
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAlamatId === alamat.id 
                        ? "border-[#2E9DF7] bg-blue-50/30" 
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="alamat" 
                      value={alamat.id}
                      checked={selectedAlamatId === alamat.id}
                      onChange={() => setSelectedAlamatId(alamat.id)}
                      className="mt-1 w-4 h-4 text-[#2E9DF7] focus:ring-[#2E9DF7]"
                    />
                    <div>
                      <h3 className="text-xs font-extrabold text-[#1B2A6B] uppercase mb-1">
                        {alamat.namaUser} {alamat.noTelepon && `- ${alamat.noTelepon}`}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{alamat.content}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Section Review Pesanan */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-extrabold text-[#1B2A6B] mb-4">Review Pesanan Anda</h2>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.produk.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-extrabold text-[#1B2A6B] truncate">{item.produk.nama}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.qty} x Rp {(item.produk.harga ?? 0).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div className="text-sm font-extrabold text-[#1B2A6B]">
                    Rp {((item.produk.harga ?? 0) * item.qty).toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Kolom Kanan: Ringkasan Pembayaran */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit space-y-5 sticky top-24">
          <h2 className="text-base font-extrabold text-[#1B2A6B]">Ringkasan Pembayaran</h2>
          
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal ({cartItems.reduce((a, b) => a + b.qty, 0)} item)</span>
              <span className="font-bold text-gray-700">Rp {subTotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Biaya Layanan</span>
              <span className="font-bold text-gray-700">Rp {biayaLayanan.toLocaleString("id-ID")}</span>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span className="text-sm font-extrabold text-[#1B2A6B]">Total Bayar</span>
            <span className="text-lg font-extrabold text-[#2E9DF7]">
              Rp {grandTotal.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing || !selectedAlamatId || cartItems.length === 0}
            className="w-full bg-[#1B2A6B] hover:bg-[#111A42] disabled:bg-gray-400 text-white py-3.5 rounded-xl text-xs font-bold shadow-md transition-all flex justify-center items-center gap-2"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyiapkan Pembayaran...
              </>
            ) : (
              "Bayar Sekarang"
            )}
          </button>
          
          <div className="text-center flex items-center justify-center gap-1 mt-3">
            <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pembayaran Aman</span>
          </div>
        </div>
      </div>
    </div>
  );
}
