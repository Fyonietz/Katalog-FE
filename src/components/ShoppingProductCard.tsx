// components/ShoppingProductCard.tsx
import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import type { Produk } from "../models/Produk";

interface ShoppingProductCardProps {
  produk: Produk;
  qty: number;
  onQtyChange: (qty: number) => void;
  onAddToCart: () => void;
  onClickCard: () => void;
}

function getImageUrl(imagePath?: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const baseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const cleanBase = baseUrl.replace(/\/+$/, "");
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${cleanBase}${cleanPath}`;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { ease: "easeOut", duration: 0.4 } 
  },
};

export default function ShoppingProductCard({
  produk,
  qty,
  onQtyChange,
  onAddToCart,
  onClickCard,
}: ShoppingProductCardProps) {
  const namaKategori = produk.kategoryProduct?.nama ?? "Produk";
  const namaProduk = produk.nama ?? "Nama Produk";
  const harga = produk.harga ?? 0;
  const imageUrl = getImageUrl(produk.imagePath);

  return (
    <motion.div
      layout
      variants={itemVariants}
      onClick={onClickCard}
      /* min-w-[210px] memastikan kartu menyesuaikan lebar tombol */
      className="flex flex-col min-w-[210px] w-full rounded-2xl border border-gray-100 bg-white overflow-hidden group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={imageUrl}
          alt={namaProduk}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-[#2E9DF7] uppercase tracking-wider mb-1">
          {namaKategori}
        </span>
        <h3 className="text-sm md:text-base font-bold text-[#1B2A6B] line-clamp-2 leading-tight">{namaProduk}</h3>
        
        <p className="mt-1 text-xs md:text-sm font-medium text-[#1B2A6B]">
          Rp{harga.toLocaleString("id-ID")}
        </p>

        {/* --- 2 TOMBOL BERDAMPINGAN DENGAN UKURAN KUNCI --- */}
        <div className="mt-auto pt-4 flex items-center gap-2">
          
          {/* Kontrol QTY */}
          <div 
            className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 shrink-0" 
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onQtyChange(qty - 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-white hover:text-[#1B2A6B] hover:shadow-sm transition-all"
            >
              <Minus className="w-3.5 h-3.5" />
            </motion.button>
            <span className="text-xs font-bold w-6 text-center">{qty}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onQtyChange(qty + 1)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-white hover:text-[#1B2A6B] hover:shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Tombol Tambah */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="flex-1 whitespace-nowrap px-3 py-2 rounded-xl bg-[#1B2A6B] text-xs font-bold text-white hover:bg-[#111A42] transition-colors shadow-md shadow-blue-900/20 text-center"
          >
            Tambah
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
