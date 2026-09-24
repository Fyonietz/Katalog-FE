// src/pages/Pelanggan/KeranjangPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

interface CartItem {
  id: number;
  idProduct: number;
  namaProduct: string;
  harga?: number;
  hargaSatuan?: number; // Antisipasi jika properti backend menggunakan ini
  qty: number;
  imagePath?: string;
  ukuranCustom?: string;
  notes?: string;
}

export default function KeranjangPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = () => {
      setLoading(true);
      try {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartItems(localCart);
      } catch (err) {
        console.error("Gagal memuat keranjang", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleUpdateQty = (id: number, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const handleRemoveItem = (id: number) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  // Safe calculation dengan fallback ke 0 jika harga undefined
  const totalHarga = cartItems.reduce((acc, item) => {
    const price = item.harga ?? item.hargaSatuan ?? 0;
    return acc + (price * item.qty);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Keranjang Belanja</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Periksa kembali item cetak pesanan Anda sebelum melanjutkan ke pembayaran.</p>
      </div>

      {loading ? (
        <div className="h-48 bg-white rounded-3xl animate-pulse border border-gray-100"></div>
      ) : cartItems.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#2E9DF7] rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-extrabold text-[#1B2A6B]">Keranjang Belanja Kosong</p>
            <p className="text-xs text-gray-400 mt-1">Belum ada produk cetak yang ditambahkan ke keranjang Anda.</p>
          </div>
          <Link to="/shopping" className="inline-flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#111A42] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all">
            Mulai Belanja <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Daftar Item (Kolom Kiri - Lebar 2) */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const itemPrice = item.harga ?? item.hargaSatuan ?? 0;

              return (
                <div key={item.id} className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-all">
                  
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {item.imagePath ? (
                        <img src={item.imagePath} alt={item.namaProduct} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <h3 className="font-extrabold text-[#1B2A6B] text-sm md:text-base">{item.namaProduct}</h3>
                      <p className="text-xs font-black text-[#2E9DF7]">Rp {itemPrice.toLocaleString("id-ID")}</p>
                      
                      {(item.ukuranCustom || item.notes) && (
                        <div className="text-[10px] text-gray-400 font-medium space-y-0.5 pt-1">
                          {item.ukuranCustom && <p>• Ukuran: {item.ukuranCustom}</p>}
                          {item.notes && <p>• Catatan: {item.notes}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kontrol Qty & Tombol Hapus */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-sm">
                      <button 
                        onClick={() => handleUpdateQty(item.id, -1)} 
                        className="px-3 py-1.5 text-xs font-extrabold text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-black text-[#1B2A6B]">{item.qty}</span>
                      <button 
                        onClick={() => handleUpdateQty(item.id, 1)} 
                        className="px-3 py-1.5 text-xs font-extrabold text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(item.id)} 
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-gray-100"
                      title="Hapus item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Ringkasan Belanja (Kolom Kanan - Lebar 1 - Sticky) */}
          <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-5 sticky top-6">
            <h2 className="text-base font-extrabold text-[#1B2A6B] border-b border-gray-100 pb-3">Ringkasan Belanja</h2>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Total Item</span>
                <span className="font-bold text-gray-700">{cartItems.reduce((a, c) => a + c.qty, 0)} Produk</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Estimasi Biaya Cetak</span>
                <span className="font-bold text-gray-700">Rp {totalHarga.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Total Bayar</span>
              <span className="text-lg font-black text-[#2E9DF7]">Rp {totalHarga.toLocaleString("id-ID")}</span>
            </div>

            <button 
              onClick={() => navigate("/shopping/checkout")} 
              className="w-full bg-[#1B2A6B] hover:bg-[#111A42] text-white py-3.5 rounded-2xl text-xs font-extrabold transition-all shadow-md shadow-[#1B2A6B]/20 flex items-center justify-center gap-2"
            >
              Lanjut ke Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
