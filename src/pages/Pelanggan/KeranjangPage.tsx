// src/pages/Pelanggan/KeranjangPage.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import type { CartItem } from "../../models/CartItem";
import { getCart, getCartCount, getCartTotal, removeFromCart, updateQty } from "../../services/cartService";
import { getImageUrl } from "../../utils/getImageUrl";
import {
  dimensionUnitLabel,
  estimateItemSubtotal,
  getDimensionUnit,
  getPricingMode,
  pricingRateSuffix,
  resolveRate,
} from "../../utils/pricing";

/** Ringkasan dimensi satu baris keranjang, mis. "3 x 1 meter". */
function formatDims(item: CartItem): string | null {
  const mode = getPricingMode(item.produk);
  const unit = dimensionUnitLabel(getDimensionUnit(item.produk));
  if (mode === "PerArea" && item.width && item.height) return `${item.width} x ${item.height} ${unit}`;
  if (mode === "PerLength" && item.length) return `${item.length} ${unit}`;
  return null;
}

export default function KeranjangPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = () => setCartItems(getCart());

  useEffect(() => {
    try {
      refreshCart();
    } catch (err) {
      console.error("Gagal memuat keranjang", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateQty = (idProduct: number, delta: number) => {
    const current = cartItems.find((item) => item.produk.id === idProduct);
    if (!current) return;
    setCartItems(updateQty(idProduct, Math.max(1, current.qty + delta)));
  };

  const handleRemoveItem = (idProduct: number) => {
    setCartItems(removeFromCart(idProduct));
  };

  const totalHarga = getCartTotal(cartItems);
  const totalItem = getCartCount(cartItems);

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
              const imageUrl = getImageUrl(item.produk.imagePath);
              const dims = formatDims(item);

              return (
                <div key={item.produk.id} className="bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-all">

                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.produk.nama} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      )}
                    </div>

                    <div className="space-y-1 flex-1">
                      <h3 className="font-extrabold text-[#1B2A6B] text-sm md:text-base">{item.produk.nama}</h3>
                      <p className="text-xs font-black text-[#2E9DF7]">
                        Rp {resolveRate(item.produk, item.ukuran).toLocaleString("id-ID")}{pricingRateSuffix(getPricingMode(item.produk))}
                      </p>

                      {(dims || item.ukuran?.nama || item.ukuranCustom || item.notes) && (
                        <div className="text-[10px] text-gray-400 font-medium space-y-0.5 pt-1">
                          {dims && <p>• Dimensi: {dims}</p>}
                          {item.ukuran?.nama && <p>• Varian: {item.ukuran.nama}</p>}
                          {item.ukuranCustom && <p>• Ukuran: {item.ukuranCustom}</p>}
                          {item.notes && <p>• Catatan: {item.notes}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kontrol Qty & Tombol Hapus */}
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subtotal</p>
                      <p className="text-xs font-black text-[#1B2A6B]">Rp {estimateItemSubtotal(item).toLocaleString("id-ID")}</p>
                    </div>

                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-sm">
                      <button
                        onClick={() => handleUpdateQty(item.produk.id, -1)}
                        className="px-3 py-1.5 text-xs font-extrabold text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-4 text-xs font-black text-[#1B2A6B]">{item.qty}</span>
                      <button
                        onClick={() => handleUpdateQty(item.produk.id, 1)}
                        className="px-3 py-1.5 text-xs font-extrabold text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.produk.id)}
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
                <span className="font-bold text-gray-700">{totalItem} Produk</span>
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
            <p className="text-[10px] text-gray-400">Harga final dihitung server berdasarkan mode harga tiap produk.</p>

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
