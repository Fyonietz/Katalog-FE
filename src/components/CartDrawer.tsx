// components/CartDrawer.tsx
import { AnimatePresence, motion } from "framer-motion";
import { showModal } from "../lib/showModal";

export interface CartItem {
  produk: {
    id: number | string;
    nama?: string;
    harga?: number | string;
    hargaMulai?: number | string;
    imagePath?: string;
    gambar?: string;
    satuan?: string;
  };
  qty: number;
}

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  onUpdateQty: (id: string | number, qty: number) => void;
  onRemove: (id: string | number) => void;
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

export default function CartDrawer({
  open,
  onClose,
  cart,
  cartTotal,
  onUpdateQty,
  onRemove,
}: CartDrawerProps) {
  // Hitung ulang total secara lokal & aman jika cartTotal bernilai NaN
  const safeTotal = cart.reduce((acc, item) => {
    const rawHarga = item.produk?.harga ?? item.produk?.hargaMulai ?? 0;
    const hargaNum = typeof rawHarga === "number" ? rawHarga : parseFloat(rawHarga) || 0;
    return acc + hargaNum * (item.qty || 1);
  }, 0);

  // Gunakan safeTotal jika cartTotal bernilai NaN atau invalid
  const displayTotal = isNaN(cartTotal) || cartTotal === undefined ? safeTotal : cartTotal;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer"
          />

          {/* Drawer Slide Right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header Drawer */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-[#1B2A6B]">Keranjang Belanja</h2>
                <span className="bg-[#2E9DF7]/10 text-[#2E9DF7] text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {cart.length} Item
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* List Produk Keranjang */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10">
                  <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm font-bold text-gray-500">Keranjang Anda masih kosong</p>
                  <p className="text-xs text-gray-400 mt-1">Pilih produk cetak untuk menambahkannya ke sini.</p>
                </div>
              ) : (
                cart.map((item) => {
                  // Konversi harga yang aman dari string/number
                  const rawHarga = item.produk?.harga ?? item.produk?.hargaMulai ?? 0;
                  const hargaSatuan = typeof rawHarga === "number" ? rawHarga : parseFloat(rawHarga) || 0;
                  const totalHargaItem = hargaSatuan * (item.qty || 1);
                  
                  const imagePathSrc = item.produk?.imagePath ?? item.produk?.gambar ?? "";
                  const imageUrl = getImageUrl(imagePathSrc);
                  const namaProduk = item.produk?.nama ?? "Produk Cetak";

                  return (
                    <div
                      key={item.produk.id}
                      className="flex gap-4 p-3 rounded-2xl border border-gray-100 bg-gray-50/50 items-center"
                    >
                      <img
                        src={imageUrl}
                        alt={namaProduk}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-200 shrink-0 border border-gray-100"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-[#1B2A6B] truncate">{namaProduk}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Rp{hargaSatuan.toLocaleString("id-ID")}
                        </p>
                        
                        <p className="text-xs font-bold text-[#2E9DF7] mt-1">
                          Subtotal: Rp{totalHargaItem.toLocaleString("id-ID")}
                        </p>
                      </div>

                      {/* Kontrol QTY & Hapus */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <button
                          onClick={() => onRemove(item.produk.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          title="Hapus dari keranjang"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>

                        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-0.5 shadow-sm">
                          <button
                            onClick={() => onUpdateQty(item.produk.id, item.qty - 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-100"
                          >
                            −
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.qty}</span>
                          <button
                            onClick={() => onUpdateQty(item.produk.id, item.qty + 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Checkout */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-white flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">Total Pembayaran</span>
                  <span className="text-xl font-extrabold text-[#1B2A6B]">
                    Rp{displayTotal.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={() => showModal("Lanjut ke proses pembayaran!")}
                  className="w-full bg-[#1B2A6B] hover:bg-[#111A42] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all text-center"
                >
                  Lanjut Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
