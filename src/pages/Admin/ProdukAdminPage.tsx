 // pages/Admin/ProdukAdminPage.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import DataTable from "../../components/ui/DataTable";
import { produkColumns } from "../../config/produkColumns";
import { getProdukList } from "../../services/produkService";
import type { Produk } from "../../models/Produk";

export default function ProdukAdminPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getProdukList()
      .then(setProdukList)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen bg-[#F4F6FB]">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <h1 className="text-lg font-bold text-[#1B2A6B]">Daftar Produk</h1>
        <p className="text-sm text-gray-500 mt-0.5">Kelola produk yang tampil di katalog.</p>

        <div className="mt-6">
          <DataTable
            columns={produkColumns}
            data={produkList}
            getRowId={(row) => row.id}
            isLoading={loading}
            onEdit={(row) => console.log("Edit produk:", row.id)}
            onDelete={(row) => console.log("Hapus produk:", row.id)}
          />
        </div>
      </div>
    </div>
  );
}
