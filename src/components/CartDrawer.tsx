// src/components/CartDrawer.tsx
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { showModal } from "../lib/showModal";

export default function CartDrawer({
  open,
  onClose,
  cart,
  cartTotal,
  onUpdateQty,
  onRemove,
}: any) {
  const navigate = useNavigate();

  if (!open) return null;

  // Fungsi untuk menangani klik tombol Checkout
  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showModal("Keranjang masih kosong!", { variant: "warning", title: "Keranjang Kosong" });
      return;
    }
    
    // 1. Tutup laci keranjang
    onClose();
    
    // 2. Arahkan langsung ke halaman checkout (tanpa popup)
    navigate("/shopping/checkout");
  };

  return (
    <>
      {/* Overlay Background */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-[#1B2A6B]">Keranjang Belanja</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {cart.length} Item
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
            aria-label="Tutup keranjang"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p className="text-sm font-medium">Keranjang kamu masih kosong</p>
            </div>
          ) : (
            cart.map((item: any, index: number) => {
              const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
              const imageUrl = item.produk.imagePath
                ? item.produk.imagePath.startsWith("http")
                  ? item.produk.imagePath
                  : `${apiBaseUrl}${item.produk.imagePath}`
                : "https://via.placeholder.com/150";

              return (
                <div key={index} className="flex gap-4 p-3 border border-gray-100 rounded-2xl bg-white shadow-sm">
                  <img 
                    src={imageUrl} 
                    alt={item.produk.nama} 
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100 shrink-0" 
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="min-w-0 pr-2">
                        <h3 className="text-sm font-extrabold text-[#1B2A6B] truncate">
                          {item.produk.nama}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Rp {(item.produk.harga ?? 0).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button 
                        onClick={() => onRemove(item.produk.id)}
                        className="text-gray-400 hover:text-red-500 p-1 shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-bold text-[#2E9DF7]">
                        Subtotal: Rp {((item.produk.harga ?? 0) * item.qty).toLocaleString("id-ID")}
                      </span>
                      <div className="flex items-center gap-2 bg-gray-50 border rounded-lg p-1">
                        <button 
                          onClick={() => onUpdateQty(item.produk.id, item.qty - 1)}
                          className="w-6 h-6 rounded bg-white shadow-sm text-xs font-bold text-gray-600 flex items-center justify-center"
                        >-</button>
                        <span className="text-xs font-bold text-[#1B2A6B] w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => onUpdateQty(item.produk.id, item.qty + 1)}
                          className="w-6 h-6 rounded bg-white shadow-sm text-xs font-bold text-gray-600 flex items-center justify-center"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout */}
        <div className="p-4 border-t border-gray-200 bg-white shrink-0 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-500">Total Pembayaran</span>
            <span className="text-lg font-extrabold text-[#1B2A6B]">
              Rp {cartTotal.toLocaleString("id-ID")}
            </span>
          </div>
          
          <button
            onClick={handleProceedToCheckout}
            disabled={cart.length === 0}
            className="w-full bg-[#1B2A6B] hover:bg-[#111A42] disabled:bg-gray-400 text-white py-3.5 rounded-xl text-sm font-bold shadow-md transition-all"
          >
            Lanjut Checkout
          </button>
        </div>

      </div>
    </>
  );
}
