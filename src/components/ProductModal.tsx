// components/ProductModal.tsx
import { AnimatePresence, motion } from "framer-motion";
import type { Produk } from "../models/Produk";

interface ProductModalProps {
  produk: Produk | null;
  isOpen: boolean;
  onClose: () => void;
  qty: number;
  onQtyChange: (qty: number) => void;
  onAddToCart: () => void;
}

export default function ProductModal({
  produk,
  isOpen,
  onClose,
  qty,
  onQtyChange,
  onAddToCart,
}: ProductModalProps) {
  // Jika produk kosong, jangan render isinya
  if (!produk) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Gelap */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] cursor-pointer"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-4xl h-auto max-h-[90vh] md:h-[600px] bg-[#1B2A6B] rounded-2xl shadow-2xl overflow-hidden flex flex-col-reverse md:flex-row pointer-events-auto relative"
            >
              
              {/* --- KIRI: Panel Detail (Gaya Discord) --- */}
              <div className="w-full md:w-[45%] p-6 md:p-10 flex flex-col bg-[#1B2A6B] text-white overflow-y-auto no-scrollbar">
                
                {/* Badge Kategori/Label */}
                <div className="mb-4">
                  <span className="bg-white/10 text-white border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                    Premium Print
                  </span>
                </div>

                <h2 className="text-2xl md:text-4xl font-black leading-tight mb-2">
                  {produk.nama}
                </h2>
                
                {/* Deskripsi (Bisa disesuaikan jika data API Anda memiliki field deskripsi) */}
                <p className="text-gray-300 text-sm leading-relaxed mb-6">
                  Tingkatkan branding Anda dengan {produk.nama} berkualitas tinggi. Diproses menggunakan mesin cetak resolusi tinggi untuk warna yang tajam, awet, dan material yang premium. Sangat cocok untuk kebutuhan bisnis maupun personal.
                </p>

                <div className="mt-auto">
                  <div className="h-px w-full bg-white/10 mb-5"></div>
                  
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Harga Mulai</p>
                      <p className="text-2xl font-bold text-white">
                        Rp{produk.hargaMulai.toLocaleString("id-ID")}
                        <span className="text-sm font-normal text-gray-400 ml-1">/{produk.satuan}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* QTY Control Dark Mode */}
                    <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/10">
                      <button 
                        onClick={() => onQtyChange(Math.max(1, qty - 1))}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
                      >−</button>
                      <span className="w-8 text-center font-bold text-white">{qty}</span>
                      <button 
                        onClick={() => onQtyChange(qty + 1)}
                        className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
                      >+</button>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart();
                        onClose(); // Tutup modal setelah masuk keranjang
                      }}
                      className="flex-1 bg-[#2E9DF7] hover:bg-[#1f84d6] text-white py-3.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      Buy / Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* --- KANAN: Visual/Gambar Full --- */}
              <div className="w-full md:w-[55%] h-[250px] md:h-full relative bg-gray-900 group">
                <img
                  src={produk.gambar}
                  alt={produk.nama}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1B2A6B] to-transparent md:w-24 opacity-80 hidden md:block"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B2A6B] to-transparent h-16 top-auto opacity-100 block md:hidden"></div>
                
                {/* Tombol Floating Action di Sudut Kanan Atas (Gaya Discord) */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </button>
                  <button onClick={onClose} className="w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
