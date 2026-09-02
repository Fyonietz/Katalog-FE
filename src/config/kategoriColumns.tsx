// src/config/kategoriColumns.tsx
import type { KategoriProduct } from "../services/kategoriService";

export const kategoriColumns = [
  {
    header: "ID Kategori",
    accessor: (row: KategoriProduct) => (
      <span className="font-mono text-xs text-gray-400 font-bold">#{row.id}</span>
    ),
  },
  {
    header: "Nama Kategori",
    accessor: (row: KategoriProduct) => (
      <span className="font-bold text-[#1B2A6B] text-sm">{row.nama ?? "-"}</span>
    ),
  },
];
