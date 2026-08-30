 // config/produkColumns.tsx
import type { Column } from "../components/ui/DataTable";
import type { Produk } from "../models/Produk";

export const produkColumns: Column<Produk>[] = [
  {
    key: "imagePath",
    label: "Gambar",
    render: (row) => (
      <img src={row.imagePath} alt={row.nama} className="h-10 w-10 rounded-md object-cover" />
    ),
  },
  { key: "nama", label: "Nama Produk" },
  {
    key: "kategoryProduct",
    label: "Kategori",
    render: (row) => row.kategoryProduct.nama,
  },
  {
    key: "harga",
    label: "Harga",
    render: (row) => `Rp${row.harga.toLocaleString("id-ID")}`,
  },
  {
    key: "diskon",
    label: "Diskon",
    render: (row) => (row.diskon > 0 ? `${row.diskon}%` : "-"),
  },
  {
    key: "statusProduct",
    label: "Status",
    render: (row) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          row.statusProduct.nama === "Tersedia"
            ? "bg-green-50 text-green-600"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {row.statusProduct.nama}
      </span>
    ),
  },
];
