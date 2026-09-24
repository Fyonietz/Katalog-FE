// src/config/layananColumns.tsx
import type { Layanan } from "../services/layananService";
import { getImageUrl } from "../utils/getImageUrl";

export const layananColumns = [
  {
    header: "ID",
    accessor: (row: Layanan) => (
      <span className="font-mono text-xs font-bold text-gray-400">#{row.id}</span>
    ),
  },
  {
    header: "Gambar",
    accessor: (row: Layanan) => {
      const imageUrl = getImageUrl(row.imagePath ?? undefined);
      return (
        <div
          className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200 shrink-0"
          style={row.backgroundColor ? { backgroundColor: row.backgroundColor } : undefined}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={row.nama ?? "Layanan"} className="w-full h-full object-cover" />
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
    header: "Nama Layanan",
    accessor: (row: Layanan) => (
      <span className="font-bold text-[#1B2A6B] text-sm">{row.nama ?? "-"}</span>
    ),
  },
  {
    header: "Deskripsi",
    accessor: (row: Layanan) => (
      <p className="max-w-xs whitespace-normal text-xs leading-relaxed text-gray-500">
        {row.deskripsi || "-"}
      </p>
    ),
  },
  {
    header: "Warna Latar",
    accessor: (row: Layanan) => (
      <div className="flex items-center gap-2">
        <span
          className="h-5 w-5 rounded-md border border-gray-200"
          style={{ backgroundColor: row.backgroundColor ?? "#FFFFFF" }}
        />
        <span className="font-mono text-xs text-gray-400">{row.backgroundColor ?? "-"}</span>
      </div>
    ),
  },
];
