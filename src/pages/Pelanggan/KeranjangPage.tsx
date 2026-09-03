// src/pages/Pelanggan/KeranjangPage.tsx
import { useEffect, useState } from "react";
import {
  getCart,
  updateQty, // Ganti updateCartQty menjadi updateQty
  removeFromCart,
  getCartTotal,
} from "../../services/cartService";
import { getProdukList } from "../../services/produkService";
import ProductModal from "../../components/ProductModal";
import { showModal } from "../../lib/showModal";
import type { CartItem } from "../../models/CartItem";
import type { Produk } from "../../models/Produk";

export default function KeranjangPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduk, setSelectedProduk] = useState<Produk | null>(null);

  const refreshCart = () => {
    setCartItems(getCart());
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleOpenDetail = async (id: number) => {
    try {
      const list = await getProdukList();
      const detail = list.find((p) => p.id === id);
      if (detail) {
        setSelectedProduk(detail);
      } else {
        const item = cartItems.find((c) => c.produk.id === id);
        if (item) setSelectedProduk(item.produk);
      }
    } catch {
      const item = cartItems.find((c) => c.produk.id === id);
      if (item) setSelectedProduk(item.produk);
    }
  };

  const handleUpdateQty = (id: number, newQty: number) => {
    updateQty(id, newQty); // Menggunakan updateQty
    refreshCart();
  };

  const handleRemove = (id: number) => {
    removeFromCart(id);
    refreshCart();
  };

  const totalHarga = getCartTotal(cartItems);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-[#1B2A6B]">Keranjang Belanja</h1>
        <p className="text-xs md:text-sm text-gray-500 mt-1">Daftar item cetak yang siap kamu pesan.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-sm font-bold text-gray-600">Keranjang Kamu Masih Kosong</p>
          <a href="/shopping" className="mt-4 inline-block bg-[#1B2A6B] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md">
            Jelajahi Katalog Produk
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(({ produk, qty }) => {
              const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
              const imageUrl = produk.imagePath
                ? produk.imagePath.startsWith("http")
                  ? produk.imagePath
                  : `${apiBaseUrl}${produk.imagePath}`
                : "https://via.placeholder.com/150";

              return (
                <div
                  key={produk.id}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 items-center justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={imageUrl}
                      alt={produk.nama}
                      onClick={() => handleOpenDetail(produk.id)}
                      className="w-20 h-20 object-cover rounded-xl border border-gray-100 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                    />
                    <div className="min-w-0">
                      <h3
                        onClick={() => handleOpenDetail(produk.id)}
                        className="text-sm font-extrabold text-[#1B2A6B] truncate cursor-pointer hover:text-[#2E9DF7]"
                      >
                        {produk.nama}
                      </h3>
                      <p className="text-xs font-bold text-gray-500 mt-0.5">
                        Rp {(produk.harga ?? 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <button
                      onClick={() => handleRemove(produk.id)}
                      className="text-gray-400 hover:text-red-500 text-xs font-bold p-1"
                    >
                      ✕
                    </button>
                    <div className="flex items-center gap-2 bg-gray-50 border rounded-xl p-1">
                      <button
                        onClick={() => handleUpdateQty(produk.id, qty - 1)}
                        className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-[#1B2A6B] w-6 text-center">{qty}</span>
                      <button
                        onClick={() => handleUpdateQty(produk.id, qty + 1)}
                        className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm h-fit space-y-4">
            <h2 className="text-base font-extrabold text-[#1B2A6B]">Ringkasan Belanja</h2>
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="text-xs font-extrabold text-[#1B2A6B]">Total Bayar</span>
              <span className="text-base font-extrabold text-[#2E9DF7]">
                Rp {totalHarga.toLocaleString("id-ID")}
              </span>
            </div>
            <button
              onClick={() => showModal("Lanjut ke proses Checkout!")}
              className="w-full bg-[#1B2A6B] hover:bg-[#111A42] text-white py-3 rounded-xl text-xs font-bold shadow-md"
            >
              Lanjut ke Checkout
            </button>
          </div>
        </div>
      )}

      <ProductModal
        produk={selectedProduk}
        isOpen={selectedProduk !== null}
        onClose={() => setSelectedProduk(null)}
        qty={selectedProduk ? cartItems.find((c) => c.produk.id === selectedProduk.id)?.qty ?? 1 : 1}
        onQtyChange={(newQty) => {
          if (selectedProduk) {
            handleUpdateQty(selectedProduk.id, newQty);
          }
        }}
        onAddToCart={() => {
          setSelectedProduk(null);
          refreshCart();
        }}
      />
    </div>
  );
}
