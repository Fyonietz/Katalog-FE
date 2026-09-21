// src/components/ProductModal.tsx
import { useState, useEffect } from "react";
import type { Produk } from "../models/Produk";
import { addToCart } from "../services/cartService";

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
  const [ukuranCustom, setUkuranCustom] = useState("");
  const [notes, setNotes] = useState("");
  const [desainText, setDesainText] = useState("");
  const [desainFile, setDesainFile] = useState<File | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUkuranCustom("");
      setNotes("");
      setDesainText("");
      setDesainFile(null);
    }
  }, [isOpen]);

  if (!isOpen || !produk) return null;

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
  const imageUrl = produk.imagePath
    ? produk.imagePath.startsWith("http")
      ? produk.imagePath
      : `${apiBaseUrl}${produk.imagePath}`
    : "https://via.placeholder.com/300";

  const handleAddWithCustomization = () => {
    // Kita mengirim undefined untuk idUkuranProduk karena kita menggunakan input ukuranCustom
    addToCart(produk, qty, undefined, ukuranCustom, notes, desainText, desainFile);
    onAddToCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <h3 className="font-extrabold text-[#1B2A6B] text-base">Detail & Kustomisasi Cetak</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <img src={imageUrl} alt={produk.nama} className="w-full h-48 object-cover rounded-2xl border" />
          
          <div>
            <h2 className="text-lg font-extrabold text-[#1B2A6B]">{produk.nama}</h2>
            <p className="text-sm font-bold text-[#2E9DF7] mt-1">Rp {(produk.harga ?? 0).toLocaleString("id-ID")}</p>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{produk.deskripsi}</p>
          </div>

          <hr className="border-gray-100" />

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-[#1B2A6B] uppercase tracking-wider">Form Kustomisasi Pesanan</h4>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ukuran Custom (Opsional)</label>
              <input
                type="text"
                value={ukuranCustom}
                onChange={(e) => setUkuranCustom(e.target.value)}
                placeholder="Contoh: A3, 2x3 meter..."
                className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2E9DF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Catatan Tambahan / Finishing (Opsional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Laminasi glossy, mata ayam..."
                className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2E9DF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Teks pada Desain (Opsional)</label>
              <input
                type="text"
                value={desainText}
                onChange={(e) => setDesainText(e.target.value)}
                placeholder="Contoh: Selamat Ulang Tahun"
                className="w-full p-2.5 border rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#2E9DF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Upload File Desain (Opsional)</label>
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setDesainFile(e.target.files[0]);
                  }
                }}
                className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-[#2E9DF7] hover:file:bg-blue-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs font-bold text-gray-700">Jumlah Cetak:</span>
            <div className="flex items-center gap-3 bg-gray-50 border rounded-xl p-1.5">
              <button
                onClick={() => onQtyChange(Math.max(1, qty - 1))}
                className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600"
              >-</button>
              <span className="text-xs font-bold text-[#1B2A6B] w-6 text-center">{qty}</span>
              <button
                onClick={() => onQtyChange(qty + 1)}
                className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs font-bold text-gray-600"
              >+</button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2.5 border rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100">Batal</button>
          <button
            onClick={handleAddWithCustomization}
            className="px-5 py-2.5 bg-[#1B2A6B] text-white rounded-xl text-xs font-bold hover:bg-[#111A42] shadow-md"
          >
            Masukkan ke Keranjang
          </button>
        </div>

      </div>
    </div>
  );
}
