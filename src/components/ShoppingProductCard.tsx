// components/ShoppingProductCard.tsx
import { motion } from "framer-motion";
import type { Produk } from "../models/Produk";

interface ShoppingProductCardProps {
  produk: Produk;
  qty: number;
  onQtyChange: (qty: number) => void;
  onAddToCart: () => void;
  onClickCard: () => void;
}

// Varian anak diubah menggunakan easeOut agar mulus dan tidak membal
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
  return (
    <motion.div
      layout
      variants={itemVariants}
      onClick={onClickCard}
      className="flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden group hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={produk.gambar}
          alt={produk.nama}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm md:text-base font-bold text-[#1B2A6B] line-clamp-2 leading-tight">{produk.nama}</h3>
        <p className="mt-1 text-xs md:text-sm font-medium text-[#2E9DF7]">
          Rp{produk.hargaMulai.toLocaleString("id-ID")}<span className="text-gray-400 font-normal">/{produk.satuan}</span>
        </p>

        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          
          <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 p-0.5" 
               onClick={(e) => e.stopPropagation()}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onQtyChange(qty - 1)}
              className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#1B2A6B] hover:shadow-sm transition-all"
            >−</motion.button>
            <span className="text-xs font-semibold w-6 text-center">{qty}</span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => onQtyChange(qty + 1)}
              className="w-8 h-8 rounded-md flex items-center justify-center text-gray-500 hover:bg-white hover:text-[#1B2A6B] hover:shadow-sm transition-all"
            >+</motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart();
            }}
            className="flex-1 rounded-xl bg-[#1B2A6B] py-2 text-xs md:text-sm font-bold text-white hover:bg-[#111A42] transition-colors shadow-md shadow-blue-900/20"
          >
            Tambah
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
