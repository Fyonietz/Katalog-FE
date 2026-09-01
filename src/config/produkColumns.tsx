// src/config/produkColumns.tsx
import type { Produk } from "../models/Produk";
import { getImageUrl } from "../utils/getImageUrl";

export const produkColumns = [
  {
    header: "Gambar",
    accessor: (row: Produk) => {
      const imageUrl = getImageUrl(row.imagePath);
      return (
        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={row.nama ?? "Produk"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
              No Image
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Nama Produk",
    accessor: (row: Produk) => (
      <div>
        <p className="font-bold text-[#1B2A6B] text-sm">{row.nama ?? "-"}</p>
        <p className="text-xs text-gray-400 line-clamp-1">{row.deskripsi ?? "-"}</p>
      </div>
    ),
  },
  {
    header: "Kategori",
    accessor: (row: Produk) => (
      <span className="bg-blue-50 text-[#2E9DF7] text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-100">
        {row.kategoryProduct?.nama ?? "Umum"}
      </span>
    ),
  },
  {
    header: "Harga",
    accessor: (row: Produk) => {
      const harga = typeof row.harga === "number" ? row.harga : parseFloat(row.harga || "0") || 0;
      return <span className="font-bold text-gray-700 text-sm">Rp{harga.toLocaleString("id-ID")}</span>;
    },
  },
  {
    header: "Status",
    accessor: (row: Produk) => (
      <span className="bg-green-50 text-green-600 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-100">
        {row.statusProduct?.nama ?? "Tersedia"}
      </span>
    ),
  },
];
