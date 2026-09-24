 // src/components/ShoppingProductCard.tsx
import { motion } from "framer-motion";
import type { Produk } from "../models/Produk";

interface ShoppingProductCardProps {
  produk: Produk;
  qty: number;
  onQtyChange: (qty: number) => void;
  onAddToCart: () => void;
  onClickCard: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9 }
};

export default function ShoppingProductCard({
  produk,
  qty,
  onQtyChange,
  onAddToCart,
  onClickCard,
}: ShoppingProductCardProps) {
  const API_URL = import.meta.env.VITE_API_BASE_URL || "";
  
  // Pastikan URL gambar valid
  const imageUrl = produk.imagePath
    ? produk.imagePath.startsWith("http")
      ? produk.imagePath
      : `${API_URL}${produk.imagePath}`
    : "https://via.placeholder.com/300";

  return (
    <motion.div
      variants={itemVariants}
      layout
      onClick={onClickCard}
      // PERBAIKAN: min-w-0 dan w-full memaksa kartu tidak melebihi sel grid
      className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer w-full min-w-0"
    >
      {/* Gambar Produk */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 shrink-0">
        <img
          src={imageUrl}
          alt={produk.nama}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Label Kategori Melayang */}
        {produk.kategoryProduct?.nama && (
          <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[#2E9DF7] text-[9px] font-extrabold px-2 py-1 rounded-md shadow-sm uppercase tracking-wider">
            {produk.kategoryProduct.nama}
          </div>
        )}
      </div>

      {/* Konten Produk */}
      <div className="p-3 md:p-4 flex flex-col flex-1">
        
        {/* Nama dan Harga */}
        <div className="mb-2 flex-1 min-w-0">
          <h3 className="font-extrabold text-[#1B2A6B] text-xs md:text-sm leading-tight line-clamp-2 break-words">
            {produk.nama}
          </h3>
          <p className="font-black text-[#2E9DF7] mt-1 md:mt-1.5 text-sm md:text-base">
            Rp {(produk.harga ?? 0).toLocaleString("id-ID")}
          </p>
        </div>

        {/* Action Buttons (Tombol Qty & Tambah) */}
        {/* PERBAIKAN: flex-col di HP agar bersusun ke bawah, sm:flex-row di layar besar */}
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-2 w-full shrink-0">
          
          {/* Kontrol Kuantitas */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-1 w-full sm:w-[90px] shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(Math.max(1, qty - 1));
              }}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all text-sm font-bold"
            >
              -
            </button>
            <span className="text-xs font-bold text-[#1B2A6B] w-6 text-center">{qty}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQtyChange(qty + 1);
              }}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-lg transition-all text-sm font-bold"
            >
              +
            </button>
          </div>

          {/* Tombol Tambah */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="w-full bg-[#1B2A6B] text-white text-[11px] md:text-xs font-bold py-2 md:py-2.5 px-3 rounded-xl hover:bg-[#111A42] transition-colors shadow-sm flex-1 whitespace-nowrap"
          >
            Tambah
          </button>
          
        </div>

      </div>
    </motion.div>
  );
}
