// src/pages/Admin/KategoriProdukAdminPage.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import DataTable from "../../components/ui/DataTable";
import { kategoriColumns } from "../../config/kategoriColumns";
import {
  getKategoriList,
  createKategori,
  updateKategori,
  deleteKategori,
  type KategoriProduct,
} from "../../services/kategoriService";

export default function KategoriProdukAdminPage() {
  const [kategoriList, setKategoriList] = useState<KategoriProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingKategori, setEditingKategori] = useState<KategoriProduct | null>(null);
  const [nama, setNama] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load Data Kategori
  const loadData = () => {
    setLoading(true);
    getKategoriList()
      .then(setKategoriList)
      .catch((err) => console.error("Gagal memuat kategori:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // Modal Action Handlers
  const handleOpenCreateModal = () => {
    setEditingKategori(null);
    setNama("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (kategori: KategoriProduct) => {
    setEditingKategori(kategori);
    setNama(kategori.nama ?? "");
    setIsModalOpen(true);
  };

  // Submit Handler (Create / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) return;

    try {
      setSubmitting(true);
      if (editingKategori) {
        await updateKategori(editingKategori.id, nama);
        alert("Kategori berhasil diperbarui!");
      } else {
        await createKategori(nama);
        alert("Kategori berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      setNama("");
      loadData();
    } catch (err: any) {
      console.error("Gagal menyimpan kategori:", err);
      alert(err.response?.data?.detail || "Gagal menyimpan kategori.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Handler
  const handleDelete = async (kategori: KategoriProduct) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kategori "${kategori.nama}"?`)) {
      try {
        await deleteKategori(kategori.id);
        alert("Kategori berhasil dihapus!");
        loadData();
      } catch (err: any) {
        console.error("Gagal menghapus kategori:", err);
        alert(err.response?.data?.detail || "Gagal menghapus kategori.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB]">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#1B2A6B]">Kategori Produk</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola jenis dan kelompok produk percetakan.</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#111A42] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Kategori
          </button>
        </div>

        <DataTable
          columns={kategoriColumns}
          data={kategoriList}
          getRowId={(row, index) => row.id?.toString() ?? `kat-${index}`}
          isLoading={loading}
          onEdit={(row) => handleOpenEditModal(row)}
          onDelete={(row) => handleDelete(row)}
        />
      </div>

      {/* --- MODAL FORM TAMBAH / EDIT KATEGORI --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-[#1B2A6B]">
                {editingKategori ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Kategori</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Digital Printing, Offset, Merchandising"
                  className="w-full px-3.5 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#1B2A6B] text-xs font-bold text-white hover:bg-[#111A42] transition-colors disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : editingKategori ? "Perbarui" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
