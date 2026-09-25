// components/ProductCard.tsx
import { motion } from "framer-motion";
import type { Produk } from "../models/Produk";
import { getPricingMode, pricingRateSuffix } from "../utils/pricing";

interface ProductCardProps {
  produk: Produk;
  onBeli: (produk: Produk) => void;
}

// Helper untuk gabungkan VITE_API_BASE_URL
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

export default function ProductCard({ produk, onBeli }: ProductCardProps) {
  // Safe Access dengan Fallback Nilai
  const namaKategori = produk.kategoryProduct?.nama ?? "Percetakan";
  const namaProduk = produk.nama ?? "Nama Produk";
  const rawHarga = produk.harga ?? 0;
  const hargaSatuan = typeof rawHarga === "number" ? rawHarga : parseFloat(rawHarga) || 0;
  const imageUrl = getImageUrl(produk.imagePath);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      transition={{ ease: "easeOut", duration: 0.3 }}
      className="flex flex-col min-w-[210px] w-full rounded-2xl border border-gray-100 bg-white overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={imageUrl}
          alt={namaProduk}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[10px] font-bold text-[#2E9DF7] uppercase tracking-wider mb-1">
          {namaKategori}
        </span>
        <h3 className="text-sm md:text-base font-bold text-[#1B2A6B] line-clamp-2 leading-tight">
          {namaProduk}
        </h3>

        <p className="mt-1.5 text-xs md:text-sm font-bold text-[#1B2A6B]">
          Rp{hargaSatuan.toLocaleString("id-ID")}{pricingRateSuffix(getPricingMode(produk))}
        </p>

        <div className="mt-auto pt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBeli(produk);
            }}
            className="w-full rounded-xl bg-[#1B2A6B] py-2.5 px-3 text-xs font-bold text-white hover:bg-[#111A42] transition-colors shadow-md text-center"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </motion.div>
  );
}
