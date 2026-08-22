// components/ProductCard.tsx
import { motion } from "framer-motion";
import type { Produk } from "../models/Produk";

interface ProductCardProps {
  produk: Produk;
  onBeli: (produk: Produk) => void;
}

export default function ProductCard({ produk, onBeli }: ProductCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="rounded-xl border border-gray-200 bg-white overflow-hidden group"
    >
      <div className="overflow-hidden">
        <img
          src={produk.gambar}
          alt={produk.nama}
          className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-[#1B2A6B]">{produk.nama}</h3>
        <p className="mt-1 text-sm text-gray-500">
          Mulai Rp{produk.hargaMulai.toLocaleString("id-ID")}/{produk.satuan}
        </p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onBeli(produk)}
          className="mt-3 w-full rounded-lg bg-[#1B2A6B] py-2 text-sm font-semibold text-white
                     transition-colors hover:bg-[#15205A]"
        >
          Beli
        </motion.button>
      </div>
    </motion.div>
  );
}
