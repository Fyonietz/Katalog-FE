// src/pages/Admin/ProdukAdminPage.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import DataTable from "../../components/ui/DataTable";
import { produkColumns } from "../../config/produkColumns";
import { getProdukList, createProduct, updateProduct } from "../../services/produkService";
import { getKategoriList, type KategoriProduct } from "../../services/kategoriService";
import { getStatusList, type StatusProduct } from "../../services/statusService";
import { showModal } from "../../lib/showModal";
import type { Produk } from "../../models/Produk";

export default function ProdukAdminPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<KategoriProduct[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduk, setEditingProduk] = useState<Produk | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Field State
  const [idKategoriProduct, setIdKategoriProduct] = useState<number | string>("");
  const [idStatusProduct, setIdStatusProduct] = useState<number | string>("");
  const [nama, setNama] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [harga, setHarga] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Load Data Produk, Kategori, dan Status
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [dataProduk, dataKategori, dataStatus] = await Promise.all([
        getProdukList().catch(() => []),
        getKategoriList().catch(() => []),
        getStatusList().catch(() => []),
      ]);

      setProdukList(dataProduk);
      setKategoriOptions(dataKategori);
      setStatusOptions(dataStatus);

      // Default value dropdown jika ada data
      if (dataKategori.length > 0 && !idKategoriProduct) {
        setIdKategoriProduct(dataKategori[0].id);
      }
      if (dataStatus.length > 0 && !idStatusProduct) {
        setIdStatusProduct(dataStatus[0].id);
      }
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Buka Modal Tambah Produk
  const handleOpenCreateModal = () => {
    setEditingProduk(null);
    setNama("");
    setDeskripsi("");
    setHarga("");
    setBackgroundColor("#FFFFFF");
    setImageFile(null);
    if (kategoriOptions.length > 0) setIdKategoriProduct(kategoriOptions[0].id);
    if (statusOptions.length > 0) setIdStatusProduct(statusOptions[0].id);
    setIsModalOpen(true);
  };

  // Buka Modal Edit Produk
  const handleOpenEditModal = (produk: Produk) => {
    setEditingProduk(produk);
    setNama(produk.nama ?? "");
    setDeskripsi(produk.deskripsi ?? "");
    setHarga(produk.harga?.toString() ?? "0");
    setBackgroundColor(produk.backgroundColor ?? "#FFFFFF");
    setIdKategoriProduct(produk.kategoryProduct?.id ?? produk.idKategoriProduct ?? "");
    setIdStatusProduct(produk.statusProduct?.id ?? produk.idStatusProduct ?? "");
    setImageFile(null);
    setIsModalOpen(true);
  };

  // Submit Handler (Create / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("IdKategoriProduct", idKategoriProduct.toString());
      formData.append("IdStatusProduct", idStatusProduct.toString());
      formData.append("Nama", nama);
      formData.append("Deskripsi", deskripsi);
      formData.append("Harga", harga);
      formData.append("BackgroundColor", backgroundColor);
      
      if (imageFile) {
        formData.append("Image", imageFile);
      }

      if (editingProduk) {
        // Panggil endpoint PATCH jika sedang mode edit
        await updateProduct(editingProduk.id, formData);
        showModal("Produk berhasil diperbarui!");
      } else {
        // Panggil endpoint POST jika mode tambah
        await createProduct(formData);
        showModal("Produk berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      loadInitialData(); // Reload data tabel
    } catch (err: any) {
      console.error("Gagal menyimpan produk:", err);
      showModal(err.response?.data?.detail || "Gagal menyimpan produk. Periksa kembali form data Anda.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB]">
      <AdminSidebar />

      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-[#1B2A6B]">Daftar Produk</h1>
            <p className="text-sm text-gray-500 mt-0.5">Kelola produk yang tampil di katalog.</p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#111A42] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Produk
          </button>
        </div>

        <DataTable
          columns={produkColumns}
          data={produkList}
          getRowId={(row, index) => row.id?.toString() ?? `produk-${index}`}
          isLoading={loading}
          onEdit={(row) => handleOpenEditModal(row)}
          onDelete={(row) => console.log("Hapus produk:", row.id)}
        />
      </div>

      {/* --- MODAL FORM TAMBAH / EDIT PRODUK --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-extrabold text-[#1B2A6B]">
                {editingProduk ? "Edit Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Nama Produk */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Produk</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Banner Spanduk"
                  className="w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                />
              </div>

              {/* Dropdown Kategori & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
                  <select
                    required
                    value={idKategoriProduct}
                    onChange={(e) => setIdKategoriProduct(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                  >
                    {kategoriOptions.length === 0 ? (
                      <option value="">Memuat kategori...</option>
                    ) : (
                      kategoriOptions.map((kat) => (
                        <option key={kat.id} value={kat.id}>
                          {kat.nama}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select
                    required
                    value={idStatusProduct}
                    onChange={(e) => setIdStatusProduct(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                  >
                    {statusOptions.length === 0 ? (
                      <option value="">Memuat status...</option>
                    ) : (
                      statusOptions.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.nama}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Harga */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  value={harga}
                  onChange={(e) => setHarga(e.target.value)}
                  placeholder="50000"
                  className="w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                />
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Deskripsi singkat produk..."
                  className="w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                />
              </div>

              {/* Upload Gambar */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Gambar Produk {editingProduk && "(Kosongkan jika tidak ingin mengubah)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2E9DF7] hover:file:bg-blue-100"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex gap-3">
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
                  {submitting ? "Menyimpan..." : editingProduk ? "Perbarui Produk" : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
