// components/CartDrawer.tsx
import { AnimatePresence, motion } from "framer-motion";
import type { CartItem } from "../models/CartItem";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  onUpdateQty: (produkId: string, qty: number) => void;
  onRemove: (produkId: string) => void;
}

export default function CartDrawer({
  open,
  onClose,
  cart,
  cartTotal,
  onUpdateQty,
  onRemove,
}: CartDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Panel Drawer */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.5 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-white z-[60] flex flex-col shadow-2xl rounded-l-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 bg-gray-50 border-b border-gray-100">
              <h2 className="text-lg font-extrabold text-[#1B2A6B] flex items-center gap-2">
                Keranjang Belanja
                <span className="bg-[#2E9DF7] text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
              </h2>
              <button onClick={onClose} className="p-2 bg-white rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 no-scrollbar">
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-4"
                >
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[#2E9DF7] opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <p className="text-gray-400 font-medium">Keranjang kamu masih kosong,<br/>yuk mulai pilih produk cetak!</p>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div 
                        layout // Animasi meluncur saat dihapus
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        key={item.produk.id} 
                        className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                      >
                        <img
                          src={item.produk.gambar}
                          alt={item.produk.nama}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 border border-gray-50"
                        />
                        <div className="flex-1 flex flex-col">
                          <p className="text-sm font-bold text-[#1B2A6B] leading-tight">{item.produk.nama}</p>
                          <p className="text-xs font-medium text-[#2E9DF7] mt-1">
                            Rp{item.produk.hargaMulai.toLocaleString("id-ID")}
                          </p>

                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                              <motion.button whileTap={{ scale: 0.8 }} onClick={() => onUpdateQty(item.produk.id, item.qty - 1)} className="w-7 h-7 text-gray-500 hover:text-black hover:bg-gray-100 rounded-l-lg">−</motion.button>
                              <span className="text-xs font-semibold w-6 text-center">{item.qty}</span>
                              <motion.button whileTap={{ scale: 0.8 }} onClick={() => onUpdateQty(item.produk.id, item.qty + 1)} className="w-7 h-7 text-gray-500 hover:text-black hover:bg-gray-100 rounded-r-lg">+</motion.button>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemove(item.produk.id)}
                              className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer Total Belanja */}
            <div className="border-t border-gray-100 bg-white px-6 py-5 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Total Estimasi</span>
                <span className="text-xl font-black text-[#1B2A6B]">Rp{cartTotal.toLocaleString("id-ID")}</span>
              </div>
              <motion.button
                whileTap={cart.length > 0 ? { scale: 0.97 } : {}}
                disabled={cart.length === 0}
                className="w-full rounded-xl bg-[#1B2A6B] py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-900/30 hover:bg-[#111A42] transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                Checkout Sekarang
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
