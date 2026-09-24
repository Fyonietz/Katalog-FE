// src/pages/Pelanggan/CheckOutPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getCart, getCartTotal, clearCart } from "../../services/cartService";
import { getAlamatUser, type AlamatGetResponse } from "../../services/alamatService";
import { createPesanan } from "../../services/pesananService";
import type { CartItem } from "../../models/CartItem";
import { showModal } from "../../lib/showModal";

export default function CheckOutPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [alamatList, setAlamatList] = useState<AlamatGetResponse[]>([]);
  const [selectedAlamatId, setSelectedAlamatId] = useState<number | null>(null);
  const [loadingAlamat, setLoadingAlamat] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    const items = getCart();
    if (items.length === 0) {
      navigate("/dashboard/pelanggan/keranjang");
      return;
    }
    setCartItems(items);

    const fetchAlamat = async () => {
      try {
        const data = await getAlamatUser();
        setAlamatList(data || []);
        if (data && data.length > 0) setSelectedAlamatId(data[0].id);
      } catch (err) {
        console.error("Gagal mengambil alamat:", err);
      } finally {
        setLoadingAlamat(false);
      }
    };
    fetchAlamat();
  }, [navigate]);

  const subTotal = getCartTotal(cartItems);

  const handleFileUpload = (index: number, file: File | null) => {
    const updatedCart = [...cartItems];
    updatedCart[index].desainFile = file;
    setCartItems(updatedCart);
  };

  const handleBuatPesanan = async () => {
    if (!selectedAlamatId) {
      showModal("Harap pilih alamat pengiriman terlebih dahulu.", { variant: "warning" });
      return;
    }
    setIsProcessing(true);

    try {
      // 1. Rakit Form Data
      const form = new FormData();
      form.append("idAlamat", String(selectedAlamatId));

      cartItems.forEach((item, index) => {
        form.append(`items[${index}].idProduct`, String(item.produk.id));
        form.append(`items[${index}].qty`, String(item.qty));
        
        if (item.idUkuranProduk) {
          form.append(`items[${index}].idUkuranProduk`, String(item.idUkuranProduk));
        }
        if (item.ukuranCustom && item.ukuranCustom.trim() !== "") {
          form.append(`items[${index}].ukuranCustom`, item.ukuranCustom);
        }
        if (item.notes && item.notes.trim() !== "") {
          form.append(`items[${index}].notes`, item.notes);
        }
        if (item.desainText && item.desainText.trim() !== "") {
          form.append(`items[${index}].desainText`, item.desainText);
        }
        if (item.desainFile instanceof File) {
          form.append(`items[${index}].desain`, item.desainFile);
        }
      });

      // 2. Kirim pesanan ke backend TANPA memanggil Midtrans
      await createPesanan(form);
      
      // 3. Bersihkan keranjang dan pindah ke halaman pesanan
      clearCart();
      // Pesan ini membantu UX agar pengguna mengerti mereka harus membayar di halaman selanjutnya
      showModal("Pesanan berhasil dibuat! Silakan periksa kembali detail pesanan Anda sebelum melakukan pembayaran.", { variant: "success" });
      navigate('/dashboard/pelanggan/pesanan'); 
      
    } catch (error: any) {
      console.error("Error Checkout:", error);
      showModal(error.message || "Terjadi kesalahan sistem saat membuat pesanan.", { variant: "error" });
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      <div>
        <Link to="/dashboard/pelanggan/keranjang" className="text-xs font-bold text-[#2E9DF7] hover:underline mb-2 inline-block">
          &larr; Kembali ke Keranjang
        </Link>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Checkout Pesanan</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Selesaikan pembuatan pesanan Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
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
                  <label key={alamat.id} className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${selectedAlamatId === alamat.id ? "border-[#2E9DF7] bg-blue-50/30" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}>
                    <input type="radio" name="alamat" value={alamat.id} checked={selectedAlamatId === alamat.id} onChange={() => setSelectedAlamatId(alamat.id)} className="mt-1 w-4 h-4 text-[#2E9DF7] focus:ring-[#2E9DF7]" />
                    <div>
                      <h3 className="text-xs font-extrabold text-[#1B2A6B] uppercase mb-1">{alamat.namaUser} {alamat.noTelepon && `- ${alamat.noTelepon}`}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{alamat.content}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-sm font-extrabold text-[#1B2A6B] mb-4">Review Pesanan Anda</h2>
            <div className="space-y-4">
              {cartItems.map((item, idx) => (
                <div key={`${item.produk.id}-${idx}`} className="flex flex-col gap-3 py-4 border-b border-gray-50 last:border-0 last:pb-0">
                  
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-extrabold text-[#1B2A6B] truncate">{item.produk.nama}</h3>
                      
                      <div className="text-[10px] text-gray-500 mt-1 space-y-0.5">
                        {item.ukuranCustom && <p>Ukuran: <span className="font-semibold text-gray-700">{item.ukuranCustom}</span></p>}
                        {item.notes && <p>Catatan: <span className="font-semibold text-gray-700">{item.notes}</span></p>}
                        {item.desainText && <p>Teks Desain: <span className="font-semibold text-gray-700">{item.desainText}</span></p>}
                      </div>

                      <p className="text-xs font-bold text-gray-500 mt-2">{item.qty} x Rp {(item.produk.harga ?? 0).toLocaleString("id-ID")}</p>
                    </div>
                    <div className="text-sm font-extrabold text-[#1B2A6B]">
                      Rp {((item.produk.harga ?? 0) * item.qty).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div className="mt-1 bg-blue-50/50 p-3 rounded-xl border border-blue-100 border-dashed flex flex-col gap-1.5">
                    <label className="block text-[11px] font-bold text-[#1B2A6B]">Upload File Desain (Jika Ada)</label>
                    <input
                      type="file"
                      onChange={(e) => handleFileUpload(idx, e.target.files ? e.target.files[0] : null)}
                      className="w-full text-[11px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#2E9DF7] file:text-white hover:file:bg-[#1B2A6B] transition-colors cursor-pointer"
                    />
                    <p className="text-[9px] text-gray-400">*Format disarankan: JPG, PNG, PDF. (Max 10MB)</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit space-y-5 sticky top-24">
          <h2 className="text-base font-extrabold text-[#1B2A6B]">Ringkasan Total</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal Item</span>
              <span className="font-bold text-gray-700">Rp {subTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
            <span className="text-sm font-extrabold text-[#1B2A6B]">Total</span>
            <span className="text-lg font-extrabold text-[#2E9DF7]">Rp {subTotal.toLocaleString("id-ID")}</span>
          </div>
          <button 
            onClick={handleBuatPesanan} 
            disabled={isProcessing || !selectedAlamatId || cartItems.length === 0} 
            className="w-full bg-[#1B2A6B] hover:bg-[#111A42] disabled:bg-gray-400 text-white py-3.5 rounded-xl text-xs font-bold shadow-md transition-all flex justify-center items-center gap-2"
          >
            {isProcessing ? "Menyiapkan Pesanan..." : "Buat Pesanan"}
          </button>
        </div>
      </div>
    </div>
  );
}
