// src/pages/Admin/LayananAdminPage.tsx
import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import DataTable from "../../components/ui/DataTable";
import { layananColumns } from "../../config/layananColumns";
import {
  getLayananList,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  type Layanan,
} from "../../services/layananService";
import { showModal, showConfirm } from "../../lib/showModal";
import { getImageUrl } from "../../utils/getImageUrl";
import { ImagePlus, Plus, X } from "lucide-react";

const DEFAULT_BACKGROUND = "#EAF2FE";

function getErrorMessage(err: unknown): string {
  const e = err as {
    response?: { data?: { message?: string; detail?: string } };
    message?: string;
  };
  return (
    e?.response?.data?.message ??
    e?.response?.data?.detail ??
    e?.message ??
    "Terjadi kesalahan. Silakan coba lagi."
  );
}

export default function LayananAdminPage() {
  const [layananList, setLayananList] = useState<Layanan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingLayanan, setEditingLayanan] = useState<Layanan | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form Field State
  const [nama, setNama] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [backgroundColor, setBackgroundColor] = useState<string>(DEFAULT_BACKGROUND);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      setLayananList(await getLayananList());
    } catch (err) {
      console.error("Gagal memuat layanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      await loadData();
    }
    init();
  }, []);

  // Pratinjau: file baru (blob) atau gambar lama dari server.
  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : getImageUrl(editingLayanan?.imagePath ?? undefined)),
    [imageFile, editingLayanan]
  );

  // Lepaskan blob URL agar tidak menumpuk di memori.
  useEffect(() => {
    if (!previewUrl.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const filteredList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return layananList;
    return layananList.filter(
      (item) =>
        (item.nama ?? "").toLowerCase().includes(query) ||
        (item.deskripsi ?? "").toLowerCase().includes(query)
    );
  }, [layananList, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingLayanan(null);
    setNama("");
    setDeskripsi("");
    setBackgroundColor(DEFAULT_BACKGROUND);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (layanan: Layanan) => {
    setEditingLayanan(layanan);
    setNama(layanan.nama ?? "");
    setDeskripsi(layanan.deskripsi ?? "");
    setBackgroundColor(layanan.backgroundColor ?? DEFAULT_BACKGROUND);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !deskripsi.trim()) return;

    try {
      setSubmitting(true);

      // POST & PATCH layanan sama-sama multipart/form-data.
      const formData = new FormData();
      formData.append("Nama", nama.trim());
      formData.append("Deskripsi", deskripsi.trim());
      formData.append("BackgroundColor", backgroundColor);
      if (imageFile) formData.append("Image", imageFile);

      if (editingLayanan) {
        await updateLayanan(editingLayanan.id, formData);
        showModal("Layanan berhasil diperbarui!", { variant: "success" });
      } else {
        await createLayanan(formData);
        showModal("Layanan berhasil ditambahkan!", { variant: "success" });
      }

      setIsModalOpen(false);
      loadData();
    } catch (err) {
      console.error("Gagal menyimpan layanan:", err);
      showModal(getErrorMessage(err), { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (layanan: Layanan) => {
    const ok = await showConfirm(
      `Apakah Anda yakin ingin menghapus layanan "${layanan.nama}"? Data yang dihapus tidak dapat dikembalikan.`,
      { title: "Hapus Layanan", danger: true, confirmLabel: "Ya, Hapus" }
    );
    if (!ok) return;

    try {
      await deleteLayanan(layanan.id);
      showModal("Layanan berhasil dihapus!", { variant: "success" });
      loadData();
    } catch (err) {
      console.error("Gagal menghapus layanan:", err);
      showModal(getErrorMessage(err), { variant: "error" });
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6FB] overflow-hidden">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <div className="shrink-0 bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center z-10">
          <div>
            <h1 className="text-lg font-bold text-[#1B2A6B]">Layanan</h1>
            <p className="text-xs text-gray-500">
              Kelola layanan percetakan yang tampil di halaman landing.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#1B2A6B] hover:bg-[#111A42] text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            Tambah Layanan
          </button>
        </div>

        {/* Konten Utama */}
        <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full h-full flex flex-col space-y-4">
            <div className="relative w-full sm:max-w-md shrink-0">
              <input
                type="text"
                placeholder="Cari nama atau deskripsi layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#2E9DF7] focus:ring-1 focus:ring-[#2E9DF7] transition-all shadow-sm"
              />
            </div>

            <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
              <div className="flex-1 overflow-y-auto">
                <DataTable
                  columns={layananColumns}
                  data={filteredList}
                  getRowId={(row, index) => row.id?.toString() ?? `layanan-${index}`}
                  isLoading={loading}
                  onEdit={(row) => handleOpenEditModal(row)}
                  onDelete={(row) => handleDelete(row)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL FORM TAMBAH / EDIT LAYANAN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h3 className="font-extrabold text-[#1B2A6B]">
                {editingLayanan ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nama Layanan</label>
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Cetak Spanduk"
                  className="w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  required
                  value={deskripsi}
                  onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Contoh: Spanduk berbagai ukuran"
                  className="w-full px-3.5 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Warna Latar</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-14 cursor-pointer rounded-xl border border-gray-200 bg-white p-1"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1 px-3.5 py-2 border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2E9DF7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Gambar Layanan {editingLayanan ? "(opsional)" : ""}
                </label>

                {previewUrl ? (
                  <div className="mb-2 h-32 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                    <img src={previewUrl} alt="Pratinjau layanan" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="mb-2 flex h-20 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
                    <ImagePlus className="h-4 w-4" />
                    Belum ada gambar
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#2E9DF7] hover:file:bg-blue-100"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  {editingLayanan
                    ? "Biarkan kosong untuk mempertahankan gambar lama."
                    : "Format JPG/PNG. Kosongkan bila layanan tanpa gambar."}
                </p>
              </div>

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
                  disabled={submitting || !nama.trim() || !deskripsi.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#1B2A6B] text-xs font-bold text-white hover:bg-[#111A42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Menyimpan..." : editingLayanan ? "Perbarui Layanan" : "Simpan Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
