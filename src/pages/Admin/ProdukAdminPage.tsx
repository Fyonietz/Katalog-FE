// src/pages/Admin/ProdukAdminPage.tsx
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import DataTable from "../../components/ui/DataTable";
import { produkColumns } from "../../config/produkColumns";
import { getProdukList, createProduct, updateProduct, deleteProduct } from "../../services/produkService";
import { getKategoriList, type KategoriProduct } from "../../services/kategoriService";
import { getStatusList, type StatusProduct } from "../../services/statusService";
import { showModal } from "../../lib/showModal";
import type { Produk } from "../../models/Produk";

export default function ProdukAdminPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [kategoriOptions, setKategoriOptions] = useState<KategoriProduct[]>([]);
  const [statusOptions, setStatusOptions] = useState<StatusProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("Semua");

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

      if (dataKategori.length > 0 && !idKategoriProduct) setIdKategoriProduct(dataKategori[0].id);
      if (dataStatus.length > 0 && !idStatusProduct) setIdStatusProduct(dataStatus[0].id);
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // --- LOGIKA FILTERING ---
  // Buat Tab secara dinamis berdasarkan master data kategori
  const TABS = ["Semua", ...Array.from(new Set(kategoriOptions.map(k => k.nama)))];

  const finalProdukList = produkList.filter(produk => {
    // Filter Pencarian
    const searchLower = searchQuery.toLowerCase();
    const matchSearch = 
      (produk.nama?.toLowerCase() || "").includes(searchLower) ||
      (produk.deskripsi?.toLowerCase() || "").includes(searchLower);

    // Filter Tab Kategori
    const matchTab = activeTab === "Semua" || produk.kategoryProduct?.nama?.toLowerCase() === activeTab.toLowerCase();

    return matchSearch && matchTab;
  });

  // --- HANDLER MODAL & SUBMIT ---
  const handleOpenCreateModal = () => {
    setEditingProduk(null);
    setNama(""); setDeskripsi(""); setHarga(""); setBackgroundColor("#FFFFFF"); setImageFile(null);
    if (kategoriOptions.length > 0) setIdKategoriProduct(kategoriOptions[0].id);
    if (statusOptions.length > 0) setIdStatusProduct(statusOptions[0].id);
    setIsModalOpen(true);
  };

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

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini? Data yang dihapus tidak dapat dikembalikan.")) return;
    try {
      await deleteProduct(id);
      showModal("Produk berhasil dihapus!");
      loadInitialData();
    } catch (err: any) {
      showModal(err.message || "Gagal menghapus produk.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      if (editingProduk) {
        // UPDATE: Gunakan JSON sesuai dokumentasi API[cite: 2, 4]
        const payloadJson = {
          idKategoriProduct: Number(idKategoriProduct),
          idStatusProduct: Number(idStatusProduct),
          nama,
          deskripsi,
          harga: Number(harga),
          backgroundColor,
          imagePath: editingProduk.imagePath
        };
        
        await updateProduct(editingProduk.id, payloadJson);
        showModal("Produk berhasil diperbarui!");
      } else {
        // CREATE: Gunakan FormData karena ada upload file[cite: 4]
        const formData = new FormData();
        formData.append("IdKategoriProduct", idKategoriProduct.toString());
        formData.append("IdStatusProduct", idStatusProduct.toString());
        formData.append("Nama", nama);
        formData.append("Deskripsi", deskripsi);
        formData.append("Harga", harga);
        formData.append("BackgroundColor", backgroundColor);
        if (imageFile) formData.append("Image", imageFile);

        await createProduct(formData);
        showModal("Produk berhasil ditambahkan!");
      }

      setIsModalOpen(false);
      loadInitialData(); 
    } catch (err: any) {
      showModal(err.message || err.response?.data?.detail || "Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar (Tetap di atas) */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
          <div>
            <h1 className="text-lg font-bold text-[#1B2A6B]">Katalog Produk</h1>
            <p className="text-xs text-gray-500">Kelola dan tambah produk yang tampil di toko Anda.</p>
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

        {/* Konten Utama - Flex Column pembatas Tinggi */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-4">
            
            {/* Alat Filter & Pencarian */}
            <div className="shrink-0 space-y-3">
              <div className="relative w-full sm:max-w-md">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Cari nama produk atau deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#2E9DF7] focus:ring-1 focus:ring-[#2E9DF7] transition-all shadow-sm"
                />
              </div>

              {/* TABS NAVIGASI KATEGORI */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {TABS.map((tab) => {
                  const count = tab === "Semua" 
                    ? produkList.length 
                    : produkList.filter(p => p.kategoryProduct?.nama?.toLowerCase() === tab.toLowerCase()).length;

                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                        activeTab === tab 
                          ? "bg-[#1B2A6B] text-white border-[#1B2A6B] shadow-md" 
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {tab}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                        activeTab === tab ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            
            {/* TABEL INNER SCROLL */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
               {/* Asumsi: Komponen DataTable Anda sudah memiliki wrapper overflow internal atau setidaknya akan mengisi flex-1 ini secara aman */}
               <div className="flex-1 overflow-y-auto">
                 <DataTable
                   columns={produkColumns}
                   data={finalProdukList}
                   getRowId={(row, index) => row.id?.toString() ?? `produk-${index}`}
                   isLoading={loading}
                   onEdit={(row) => handleOpenEditModal(row)}
                   onDelete={(row) => handleDeleteProduct(row.id)}
                 />
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- MODAL FORM TAMBAH / EDIT PRODUK --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
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

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
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
                        <option key={kat.id} value={kat.id}>{kat.nama}</option>
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
                        <option key={st.id} value={st.id}>{st.nama}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

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

              {!editingProduk && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Gambar Produk
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2E9DF7] hover:file:bg-blue-100"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">*Gambar wajib diisi untuk produk baru.</p>
                </div>
              )}

              {editingProduk && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                  <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                    ⚠️ Mode Edit: Pengubahan gambar produk saat ini tidak didukung melalui form edit (menggunakan JSON). Gambar lama Anda akan tetap dipertahankan dengan aman di server.
                  </p>
                </div>
              )}

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
                  disabled={submitting || (!editingProduk && !imageFile)}
                  className="flex-1 py-2.5 rounded-xl bg-[#1B2A6B] text-xs font-bold text-white hover:bg-[#111A42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
